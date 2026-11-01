
import connectToDB from "@/configs/db";
import PostModel from "@/models/Post";
import { isValidObjectId } from "mongoose";
import { AppSearchParam, escapeRegex, normalizeSearchParams } from "../search";
import { attachIsLiked } from "../likes";
import { Post } from "@/types/mongooseTypes";

export const POSTS_PAGE_SIZE = 4;


export async function getSearchPosts(
   params: { q?: AppSearchParam, tag?: AppSearchParam },
   cursor?: string | null,
   userId?: string | null,
) {

   const { words, tags } = normalizeSearchParams(params);

   // If we has not any 'query' (q -> undefined, tags -> undefined),
   // In this casewe return empty-string
   // This is the current approach
   // we can also return all of posts in another approach
   if (
      !words.length &&
      !tags.length
   ) {
      return {
         posts: [],
         nextCursor: null,
      }
   }


   const filter: Record<string, unknown> = {};


   // words: [] | string[]
   // 'normalizeSearchParams()' function, converts the value of search-param 'q'
   // if it is 'string | string[]'  ->  string[]
   // if it is 'undefined'  ->  []
   // so 'words.length' means that it has any value and it is not 'undefined'
   // we used '$and' on mongoDB filter, because we want to have all of searched-words in our results - but the order does not matter
   // filter: {
   //    $and: [
   //       {
   //          title: { regex: w },
   //       },
   //       ...
   //    ]
   // }
   if (words.length) {
      filter.$and = words.map((w) => (
         {
            title: {
               $regex: escapeRegex(w),
               $options: 'i'
            }
         }
      ))
   }

   if (tags.length) {
      filter.tags = {
         $all: tags,
      }
   }
   
   // console.log('🦕 Filter: ', filter)

   // for paginated-results
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

   // console.log('🦕 Posts: ', posts)

   const plainPosts = JSON.parse(JSON.stringify(posts));

   
   return {
      posts: userId ? await attachIsLiked<Post>(plainPosts, userId) : plainPosts,
      nextCursor: hasMore ? String(posts[posts.length - 1]._id) : null,
   };
}