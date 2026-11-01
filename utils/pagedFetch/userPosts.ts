
import connectToDB from "@/configs/db";
import PostModel from "@/models/Post";
import { isValidObjectId } from "mongoose";

export const POSTS_PAGE_SIZE = 4;


export async function getUserPosts(userId: string, cursor?: string | null) {


   const filter: Record<string, unknown> = {
   };


   if (cursor && isValidObjectId(cursor)) {

      filter._id = { $lt: cursor };
   }

   await connectToDB()

   const postsDocs = await PostModel.find(
      filter
   )
      .populate("user", "avatar username")
      .sort({ _id: -1 })
      .limit(POSTS_PAGE_SIZE + 1)   
      .lean();


   const hasMore = postsDocs.length > POSTS_PAGE_SIZE;

   const posts = hasMore ? postsDocs.slice(0, POSTS_PAGE_SIZE) : postsDocs;

   return {
      posts: JSON.parse(JSON.stringify(posts)),
      // if we have not 'next page' -> 'nextCursor' will be 'null'
      // otherwise , we set the 'last post's _id' as the next-cursor
      nextCursor: hasMore ? String(posts[posts.length - 1]._id) : null,
   };
}