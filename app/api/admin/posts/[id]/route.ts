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
         return NextResponse.json({ message: "Invalid post id" }, { status: 422 });
      }

      const deletedPost = await PostModel.findOneAndDelete(
         {
            _id: id,
         }
      )

      if (!deletedPost) {
         return NextResponse.json(
            {
               message: "Not Found the Post"
            },
            {status: 404}
         )
      }

      // delete post's comments and its image from server
      const commentsLevelOneDocs = await CommentModel.find(
         {
            post: deletedPost._id
         },
         "_id image"
      ).lean();

      const commentsLevelOne = JSON.parse(JSON.stringify(commentsLevelOneDocs));
      
      const allIds = [];
      const allImages = [];

      if (deletedPost?.image) {
         allImages.push(deletedPost.image);
      }


      for (const c of commentsLevelOne) {

         allIds.push(c._id)

         if (c?.image) {
            allImages.push(c.image);
         }

         const { ids, images } = await collectCommentDescendants(c._id);

         allIds.push(...ids);
         allImages.push(...images);
      }

      await CommentModel.deleteMany({ _id: { $in: allIds } });

      const allowedBase = path.join(process.cwd(), "public", "images", "posts") + path.sep;
     
      for (const image of allImages) {

         const filePath = path.join(process.cwd(), 'public', image);

         if (!filePath.startsWith(allowedBase)) continue;

         await unlink(filePath).catch(() => {});
      }

      // delete post's likes
      await LikeModel.deleteMany({ post: { $in: [id, ...allIds] } })
      
      return NextResponse.json(
         {
            message: "Post is Deleted Succesfully",
         },
         {status: 200}
      )
   } catch (error) {

      console.log('🔴 Error -> ', error)
      
      return NextResponse.json(
         {
            message: "Internal Server Erorr"
         },
         {status: 500}
      )
   }
}