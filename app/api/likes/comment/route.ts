import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import LikeModel from "@/models/Like";
import { isDuplicateKeyError } from "@/utils/dbHelpers";
import { authUser } from "@/utils/serverHelpers";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   
   try {

      await connectToDB();

      const user = await authUser();

      if (!user) {
         return NextResponse.json(
            {
               message: "Unauthorized",
            },
            { status: 401 }
         )
      }

      const body = await req.json().catch(() => null);
      const {commentId} = body;


      if (!commentId || !isValidObjectId(commentId)) {
         return NextResponse.json(
            {
               message: "Invalid Data -> Comment-Id",
            },
            { status: 422 }
         )
      }

      const post = await CommentModel.exists({ _id: commentId });

      if (!post) {
         return NextResponse.json({
            message: "Post not found"
         }, { status: 404 });
      }


      try {
         await LikeModel.create({ user: user._id, post: commentId });
      } catch (error) {

         // becuase we have a 'unique index' for 'user <-> post' unique like
         // if user likes the liked-post again, it gives erro here (code: 11000)
         // so we return 409 in that case
         if (isDuplicateKeyError(error)) {
            return NextResponse.json({ message: "Already liked" }, { status: 409 });
         }
         throw error;
      }

      // update the comment that is liked (likesCount)
      const updatedComment = await CommentModel.findByIdAndUpdate(
         commentId,
         { $inc: { likesCount: 1 } },
         { new: true, projection: "likesCount" }
      );

      return NextResponse.json(
         {
            message: "Like is saved successfully.",
            likesCount: updatedComment?.likesCount ?? 0
         },
         { status: 201 }
      )
      
   } catch (error) {
      
      console.log('🔴 Error -> ', error);

      return NextResponse.json(
         {
            message: "internal Server Error",
         },
         { status: 500 }
      )
   }
}


export async function DELETE(req: NextRequest) {
   
   try {

      await connectToDB();

      const user = await authUser();

      if (!user) {
         return NextResponse.json(
            {
               message: "Unauthorized",
            },
            { status: 401 }
         )
      }

      const body = await req.json().catch(() => null);
      const {commentId} = body;


      if (!commentId || !isValidObjectId(commentId)) {
         return NextResponse.json(
            {
               message: "Invalid Data -> Comment-Id",
            },
            { status: 422 }
         )
      }

      const comment = await CommentModel.exists({ _id: commentId });

      if (!comment) {
         return NextResponse.json({
            message: "Comment not found"
         }, { status: 404 });
      }


      const result = await LikeModel.deleteOne(
         {
            user: user._id,
            post: commentId,
         }
      )

      if (result.deletedCount === 0) {
         return NextResponse.json({ message: "Not liked" }, { status: 409 });
      }

      const updatedComment = await CommentModel.findByIdAndUpdate(
         commentId,
         {
            $inc: {
               likesCount: -1
            }
         },
         { new: true, projection: "likesCount" }
      );


      return NextResponse.json(
         {
            message: "Like is removed successfully.",
            likesCount: Math.max(0, updatedComment?.likesCount ?? 0)
         },
         { status: 201 }
      )
      
   } catch (error) {
      
      console.log('🔴 Error -> ', error);

      return NextResponse.json(
         {
            message: "internal Server Error",
         },
         { status: 500 }
      )
   }
}