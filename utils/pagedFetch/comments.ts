
import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import { Comment } from "@/types/mongooseTypes";
import { isValidObjectId } from "mongoose";
import { attachIsLiked } from "../likes";

export const COMMENTS_PAGE_SIZE = 3;

export async function getPostComments(postId: string, cursor?: string | null, userId?: string | null) {

   const filter: Record<string, unknown> = {
      post: postId,
      parentComment: null,
   };


   if (cursor && isValidObjectId(cursor)) {

      // comments that are older than the comment that user have ($lt -> the comments that their '_id' is less than the 'cursor' -> older comments tan current cursor)

      filter._id = { $lt: cursor };
   }

   await connectToDB()
   
   const commentsDocs = await CommentModel.find(filter, )
      .populate("user", "avatar username")
      .sort({ _id: -1 })
       // We get '1 more' -> to know if we have next-page or not
      .limit(COMMENTS_PAGE_SIZE + 1)   
      .lean();


   const hasMore = commentsDocs.length > COMMENTS_PAGE_SIZE;

   let plainComments = hasMore ? commentsDocs.slice(0, COMMENTS_PAGE_SIZE) : commentsDocs;

   plainComments = JSON.parse(JSON.stringify(plainComments));

   return {
      comments: (userId) ? await attachIsLiked<Comment>(plainComments, userId) : plainComments,
      // if we have not 'next page' -> 'nextCursor' will be 'null'
      // otherwise , we set the 'last comment's _id' as the next-cursor
      nextCursor: hasMore ? String(plainComments[plainComments.length - 1]._id) : null,
   };
}