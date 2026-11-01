import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { generateAccessToken, verifyRefreshToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

   const cookieStore = await cookies();
   try {

      const refreshToken = cookieStore.get('refresh-token')?.value;

      if (!refreshToken) {
         console.log('🚫 No Refresh-Token')
         return NextResponse.json(
            {
               message: 'No refresh-token'
            },
            {status: 401}
         )
      }


      const refreshTokenPayload = verifyRefreshToken(refreshToken);

      if (!refreshTokenPayload?.email) {
         console.log('🚫 Refresh-Token Not Valid')
      
         return NextResponse.json(
            {
               message: 'Invalid refresh-token'
            },
            {status: 401}
         )
      }

      
      // check if any usser with this 'refresh-token' exists
      await connectToDB();

      const user = await UserModel.findOne(
         {
            refreshToken,
         }
      )


      if (!user) {
         console.log('🚫 Refresh-Token Not Valid - no user with this refresh-token')

         return NextResponse.json(
            {
               message: 'Invalid refresh-token'
            },
            {status: 401}
         )
      }

      if (user.isBanned) {
         console.log('🚫 Refresh is Forbidden - User is Banned')

         return NextResponse.json(
            {
               message: 'Forbidden'
            },
            {status: 403}
         )
      }


      const newAccessToken = generateAccessToken({ email: user.email });

      return NextResponse.json({ accessToken: newAccessToken })

      // the redirected request, has a 'returnTo' searchParams, that refresh to the route that user requested for that.

      // so after refreshing the token, we redirect user to 'returnTo' rotue

      // const returnTo = req.nextUrl.searchParams.get('returnTo');

      // const safeReturnTo = 
      //    (
      //       returnTo &&
      //       returnTo.startsWith('/') &&
      //       !returnTo.startsWith("//")
      //    ) ? returnTo
      //    : '/p-user'


      // const response = NextResponse.redirect(
      //    new URL(safeReturnTo, req.url)
      // )

      // response.cookies.set(
      //    'token',
      //    newAccessToken,
      //    {
      //       path: '/',
      //       httpOnly: true,
      //       maxAge: 60 * 15,
      //    }
      // )

      // return response;

   } catch (error) {
      console.log(`🔴 Error -> ${error}`);
      return NextResponse.json(
         { message: 'Internal Server Error' },
         { status: 500 }
      )
   }
}