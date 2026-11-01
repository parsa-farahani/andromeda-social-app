import connectToDB from "@/configs/db";
import PostModel from "@/models/Post";
import { escapeRegex } from "@/utils/search";



export const ADMIN_POSTS_PAGE_SIZE = 10;



// q  ->  to handle 'searching' the users in users-table

// page -> we used 'skip' for pagination (not cursor)


export async function getAdminPosts(page = 1, q?: string) {

   await connectToDB();

   const filter: Record<string, unknown> = {};

   const term = q?.trim().slice(0, 50);

   if (term) {

      const regex = {
         $regex: escapeRegex(term),
         $options: "i"
      };

      filter.$or = [
         { title: regex },
      ];
   }


   const safePage = Math.max(1, Math.floor(page) || 1);


   const [posts, totalPosts] = await Promise.all(
      [
         PostModel.find(filter)
            .sort({ _id: -1 })
            .skip((safePage - 1) * ADMIN_POSTS_PAGE_SIZE)
            .limit(ADMIN_POSTS_PAGE_SIZE)
            .populate("user", "-password")
            .lean()
         ,

         PostModel.countDocuments(filter),
      ]
   );

   return {
      posts: JSON.parse(JSON.stringify(posts)),
      totalPages: Math.max(1, Math.ceil(totalPosts / ADMIN_POSTS_PAGE_SIZE)),
      page: safePage,
   };
}