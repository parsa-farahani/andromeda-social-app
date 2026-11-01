import { NextResponse } from "next/server";
import connectToDB from '@/configs/db'
import { signupSchema } from "@/utils/validations";
import UserModel from '@/models/User'
import { generateAccessToken, generateRefreshToken, hashPassword } from "@/utils/auth";

export async function POST(req: Request) {
   
   try {

      const body: unknown = await req.json();

      // Validation
      // body: { username, email, password }
      const valdiationResult = signupSchema.safeParse(body);

      if (!valdiationResult.success) {
         return NextResponse.json(
            { message: 'Ivalid Data.' },
            { status: 422 }
         )
      }

      const { username, email, password } = valdiationResult.data;

      await connectToDB();

      // console.log('🟣 user info: ', username, email, password);

      // Check If User Exists
      const isUserExists = await UserModel.findOne(
         {
            $or: [
               { email },
               { username },
            ]
         }
      )

      if (isUserExists) {
         return NextResponse.json(
            { message: 'Username or Email Already Exists.' },
            { status: 409 }
         )
      }

      // Hash Password
      const hashedPassword = await hashPassword(password);

      // Create Token
      const accessToken = generateAccessToken({ email });

      const refreshToken = generateRefreshToken({ email });


      const users = await UserModel.find({}); 

      // Create User in DB
      await UserModel.create(
         {
            username,
            email,
            password: hashedPassword,
            refreshToken,
            role: users.length > 0 ? 'USER' : 'ADMIN',
         }
      )


      const response = NextResponse.json(
         { message: "User is Created and Signed Up Successfully." },
         { status: 201 }
      );

      response.cookies.set(
         "token",
         accessToken,
         {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 15,
         }
      )

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