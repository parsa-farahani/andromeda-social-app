import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import LikeModel from "@/models/Like";
import PostModel from "@/models/Post";
import { collectCommentDescendants } from "@/utils/dbHelpers";
import { authAdmin } from "@/utils/serverHelpers";
import { unlink } from "fs/promises";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import path from "path";


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
   
   try {

      await connectToDB();

      const admin = await authAdmin();

      if (!admin) {
         return NextResponse.json(
            {
               message: "Forbidden"
            },
            {status: 403}
         )
      }

      const { id } = await params;

      if (!isValidObjectId(id)) {
         return NextResponse.json({ message: "Invalid comment id" }, { status: 422 });
      }

      const deletedComment = await CommentModel.findById(
         id,
         "post parentComment image"
      )

      if (!deletedComment) {
         return NextResponse.json(
            {
               message: "Not Found the Comment"
            },
            {status: 404}
         )
      }

      // delete comment's comments and its image from server
      const { ids, images } = await collectCommentDescendants(deletedComment._id);

      const allIds = [deletedComment._id, ...ids];

      await CommentModel.deleteMany({ _id: { $in: allIds } });


      const allImages = [deletedComment.image, ...images].filter(Boolean) as string[];

      // path.sep  ->  the separator of 'file-path' in OS
      // e.g: in Mac/Linux -> /, in Windows -> \
      // we add the eparator in the end of images-path, to disallow deleting files
      // in other pathes (just we allow exactly in '/public/iamges/posts/')
      const allowedBase = path.join(process.cwd(), "public", "images", "posts") + path.sep;

      for (const image of allImages) {

         const filePath = path.join(process.cwd(), 'public', image);

         if (!filePath.startsWith(allowedBase)) continue;

         await unlink(filePath).catch(() => {});
      }

      
      // fix the 'refrences' to the comment, in 'Post' and its 'parent Comment'
      await PostModel.updateOne(
         {
            _id: deletedComment.post,
         },
         {
            // $pull  ->  it is reverse of '$push', it removes any element in 'comments'
            // that matches the condition
            $pull: {
               comments: {
                  $in: allIds,
               }
            }
         }
      )
      
      if (deletedComment.parentComment) {

         const parent = await CommentModel.findOneAndUpdate(
            {
               _id: deletedComment.parentComment,
            },
            {
               $pull: {
                  comments: deletedComment._id,
               },
            },
            // we specify this, to say mongoose that give us the 'changed document'
            // rather than the document before change
            // so we can later check for its '.comments.length'
            { new: true }
         )

         if (parent && parent.comments.length === 0) {
            await CommentModel.updateOne(
               { _id: parent._id },
               { $set: { hasReply: false } }
            );
         }
      }

      // delete comment's likes
      await LikeModel.deleteMany({ post: { $in: allIds } })
      

      return NextResponse.json(
         {
            message: "Comment is Deleted Succesfully",
         },
         {status: 200}
      )
   } catch (error) {

      console.log('🔴 Error -> ', error)
      
      return NextResponse.json(
         {
            message: "Internal Server Error"
         },
         {status: 500}
      )
   }
}