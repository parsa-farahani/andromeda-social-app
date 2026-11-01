import CommentModel from "@/models/Comment";
import { authUser } from "@/utils/serverHelpers";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
   
   try {

      const user = await authUser();

      if (!user) {
         return NextResponse.json(
            {message: 'Unauthorized - Login first'},
            { status: 401 }
         )
      }

      const { id } = await params;

      if (!isValidObjectId) {
         return NextResponse.json(
            {message: 'Invalid Data'},
            { status: 422 }
         )
      }

      const replies = await CommentModel.find(
         {
            parentComment: id,  
         }
      )
      .populate('user', 'avatar username')


      return NextResponse.json(
         replies,
         {status: 200}
      )
      
   } catch (error) {
      console.log(`🔴 Error -> ${error}`);
      return NextResponse.json(
         { message: 'Internal Server Error' },
         { status: 500 }
      )
   }
}