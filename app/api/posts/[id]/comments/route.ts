import connectToDB from "@/configs/db";
import { getPostComments } from "@/utils/pagedFetch/comments";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
   req: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   
   try {

      const { id } = await params;

      if (!isValidObjectId(id)) {
         return NextResponse.json(
            {message: 'Invalid Post'},
            {status: 422}
         )
      }

      const cursor = req.nextUrl.searchParams.get('cursor');
      
      await connectToDB()
      const result = await getPostComments(id, cursor)

      // await new Promise((res) => setTimeout(res, 2000))

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