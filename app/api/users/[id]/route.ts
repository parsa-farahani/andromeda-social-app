import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { generateRefreshToken } from "@/utils/auth";
import { detectImage, safeFileName } from "@/utils/media/upload";
import { authUser } from "@/utils/serverHelpers";
import { profileApiSchema } from "@/utils/validations";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import path from "path";

export async function PUT(
   req: Request,
   { params }: { params: Promise<{ id: string }> }
) {

   try {

      const user = await authUser();

      if (!user) {
         return NextResponse.json(
            {
               message: "Unauthorized"
            },
            {
               status: 401
            }
         )
      }

      const { id } = await params;

      if (id !== user._id) {
         return NextResponse.json(
            {
               message: "Unauthorized"
            },
            {
               status: 401
            }
         )
      }


      const formData = await req.formData();

      const username = formData.get('username');

      const email = formData.get('email');

      const avatarValue = formData.get('avatar');

      const avatar =
         avatarValue instanceof File && avatarValue.size > 0
         ? avatarValue
         : undefined;
      
      // console.log('🟣 Avatar: ', avatar)
      
      // Validation
      const validationResult = profileApiSchema.safeParse(
         {
            username,
            email,
            avatar,
         }
      );

      if (!validationResult.success) {

         console.log('🔴 validation Eror: ', validationResult.error.flatten());

         return NextResponse.json(
            { message: 'Ivalid Data.' },
            { status: 422 }
         )
      }

      const { username: newUsername, email: newEmail, avatar: newAvatar } = validationResult.data;

      // writing avatar on server, as image-file:
      let newAvatarPath = "";

      if (newAvatar) {

         const imgBuffer = Buffer.from( await newAvatar.arrayBuffer() );


         const ext = detectImage(imgBuffer);

         if (!ext) {
            return NextResponse.json(
               { message: 'Ivalid Data - Invalid Image File' },
               { status: 422 }
            )
         }

         const fileName = safeFileName(ext);


         const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

         const dirPath = path.join(UPLOAD_ROOT, "users");       

         await mkdir(dirPath, { recursive: true });

         await writeFile(path.join(dirPath, fileName), imgBuffer);

         newAvatarPath = `/api/files/users/${fileName}`; 

         // const dirPath = path.join( process.cwd(), 'public', 'images', `users` )

         // await mkdir(dirPath, { recursive: true });

         // const avatarPath = path.join( dirPath, fileName );

   
         // await writeFile(avatarPath, imgBuffer);

         // newAvatarPath = `/images/users/${fileName}`;

         // console.log(fileName, newAvatarPath)
      }

      // console.log('🟣 newavatar-path: ', newAvatarPath)


      await connectToDB();

      const updateData: {
         username: string;
         email: string;
         avatar?: string;
      } = {
         username: newUsername,
         email: newEmail,
      };

      if (newAvatarPath) {
         updateData.avatar = newAvatarPath;
      }

      const updatedUser = await UserModel.findOneAndUpdate(
         {
            _id: id,
         },
         {
            $set: updateData,
         },
         { new: true }
      )

      revalidatePath('/p-user')


      const cookieStore = await cookies();
      cookieStore.delete('token');
      cookieStore.delete('refresh-token');

      // Update Refresh Token in DB
      const refreshToken = generateRefreshToken({ email: updatedUser.email });

      updatedUser.refreshToken = refreshToken;
      await updatedUser.save();

      
      const response = NextResponse.json(
         { message: "User Updated SUccessfully." },
         { status: 200 }
      );


      response.cookies.set(
         "refresh-token",
         refreshToken,
         {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 15,
         }
      )

      return response;
   } catch (error) {
      
      console.log(`🔴 Error -> ${error}`);
      return NextResponse.json(
         { message: 'Internal Server Error' },
         { status: 500 }
      )
   }
}