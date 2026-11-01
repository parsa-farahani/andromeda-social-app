'use server'

import connectToDB from "@/configs/db";
import PostModel from "@/models/Post";
import { detectImage, safeFileName } from "@/utils/media/upload";
import { authUser } from "@/utils/serverHelpers";
import { postActionSchema } from "@/utils/validations";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";

export type CreatePostState = {
  error: string | null;
  isSuccess: boolean;
};


// export const createPost = async  (prevState: CreatePostState, formData: FormData): Promise<CreatePostState> => {

export const createPost = async  (formData: FormData): Promise<CreatePostState> => {

   try {

      const authenticatedUser = await authUser();

      if (!authenticatedUser || !authenticatedUser?._id) {
         return { error: "You must sign in to create post.", isSuccess: false };
      }

      const title = formData.get('title');
      // const user = formData.get('user');
      const user = authenticatedUser._id;

      const imageValue = formData.get('image');

      const image =
         imageValue instanceof File && imageValue.size > 0
         ? imageValue
         : undefined;

      const strTags = formData.get('tags');
      
      let tags = [];

      if (typeof strTags === "string") {
         try {
            tags = JSON.parse(strTags);
         } catch {
            return {
               error: "Invalid tags format",
               isSuccess: false,
            };
         }
      }


      const validationResult = postActionSchema.safeParse(
         {
            title,
            image,
            user,
            tags,
         }
      )

      if (!validationResult.success) {

         console.log('🔴 validation Eror - createPost action: ', validationResult.error.flatten());

         return {
            error: validationResult.error.issues[0]?.message
               ?? "Please check your input and try again.",
            isSuccess: false,
         }
      }

      const {
         title: validatedTitle,
         user: validatedUser,
         tags: validatedTags,
         image: validatedImage,
      } = validationResult.data;


      // Check if already such post exists (with same 'title'), dont create it again
      const isPostExist = await PostModel.findOne(
         {
            user: validatedUser,
            title: validatedTitle,
         }
      )

      if (isPostExist) {
         return {
            error: "A post with this title already exists.",
            isSuccess: false,
         }
      }


      // save image to files
      let imagePath = "";

      if (validatedImage instanceof File && validatedImage.size > 0) {

         const buffer = Buffer.from(await validatedImage.arrayBuffer());

         const ext = detectImage(buffer);
                  
         if (!ext) {
            return {
               error: 'Ivalid Data - Invalid Image File',
               isSuccess: false,
            }
         }
                  
         const fileName = safeFileName(ext);

         const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

         const dirPath = path.join(UPLOAD_ROOT, "users");       

         await mkdir(dirPath, { recursive: true });

         await writeFile(path.join(dirPath, fileName), buffer);

         imagePath = `/api/files/users/${fileName}`; 

         // const dirPath = path.join( process.cwd(), 'public', 'images', 'posts' );
         
         // await mkdir(dirPath, { recursive: true });
         

         // const filePath = path.join(dirPath, fileName);


         // await writeFile(filePath, buffer);

         // imagePath = `/images/posts/${fileName}`;
      }


      const postData = {
         title: validatedTitle,
         user: validatedUser,
         tags: validatedTags,
         ...(imagePath ? { image: imagePath } : {})
      }


      await connectToDB();

      await PostModel.create(
         postData
      )

      // console.log('✅ post is creatd successfully.')

      revalidatePath("/p-user");
      revalidatePath("/");

      return {
         error: null,
         isSuccess: true,
      }
      
   } catch (error) {
      
      console.log('🔴 Error - createPost -> ', error);

      return {
         error: "Failed to create the post. Please try again.",
         isSuccess: false,
      }
   }
}