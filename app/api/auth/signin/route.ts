import { NextResponse } from "next/server";
import connectToDB from '@/configs/db'
import { signinSchema } from "@/utils/validations";
import UserModel from '@/models/User'
import { generateAccessToken, generateRefreshToken, verifyPassword } from "@/utils/auth";

export async function POST(req: Request) {
   
   try {

      const body: unknown = await req.json();

      // Validation
      // body: { identifier, password }
      const valdiationResult = signinSchema.safeParse(body);

      if (!valdiationResult.success) {
         return NextResponse.json(
            { message: 'Ivalid Data.' },
            { status: 422 }
         )
      }

      const { identifier, password } = valdiationResult.data;

      await connectToDB();

      // console.log('🟣 user info: ', username, email, password);

      // Check If User Exists
      const user = await UserModel.findOne(
         {
            $or: [
               { email: identifier },
               { username: identifier },
            ]
         }
      )

      if (!user) {
         return NextResponse.json(
            { message: 'Username Not Found.' },
            { status: 401 }
         )
      }

      if (user.isBanned) {
         return NextResponse.json(
            { message: 'Forbidden' },
            { status: 403 }
         )
      }

      // Verify Password
      const isCorrectPassword = await verifyPassword(password, user.password);

      if (!isCorrectPassword) {
         return NextResponse.json(
            { message: 'Username or Password is not Correct.' },
            { status: 401 }
         )
      }


      // Create Tokens
      const accessToken = generateAccessToken({ email: user.email });

      const refreshToken = generateRefreshToken({ email: user.email });

      // Update Refresh Token in DB
      user.refreshToken = refreshToken;
      await user.save();

      
      const response = NextResponse.json(
         { message: "Signed In Successfully." },
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