import connectToDB from "@/configs/db";
import { getPosts } from "@/utils/pagedFetch/posts";
import { authUser } from "@/utils/serverHelpers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
   req: NextRequest,
) {
   
   try {

      const user = await authUser();

      const cursor = req.nextUrl.searchParams.get('cursor');
      
      await connectToDB()
      const result = await getPosts(cursor, user?._id)

      await new Promise((res) => setTimeout(res, 1000))

      return NextResponse.json(
         result,
         {status: 200}
      )
   } catch (error) {
      
      console.log('🔴 Error -> ', error)

      return NextResponse.json(
         {message: 'Internal Server Error'},
         {status: 500}
      )
   }
}