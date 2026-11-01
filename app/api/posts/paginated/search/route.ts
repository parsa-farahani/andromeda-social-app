import connectToDB from "@/configs/db";
import { getSearchPosts } from "@/utils/pagedFetch/search";
import { authUser } from "@/utils/serverHelpers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
   
   try {

      const user = await authUser();
      

      const q = req.nextUrl.searchParams.getAll('q') ;
      const tag = req.nextUrl.searchParams.getAll('tag') ;

      const cursor = req.nextUrl.searchParams.get('cursor');


      await connectToDB();

      const result = await getSearchPosts({ q, tag }, cursor, user?._id);

      await new Promise((res) => setTimeout(res, 1000))

      return NextResponse.json(
         result,
         {status: 200}
      )
      
   } catch (error) {
      console.log('🔴 Error -> ', error);

      return NextResponse.json(
         {
            message: 'Internal Server Error',
         },
         {status: 500}
      )
   }
}