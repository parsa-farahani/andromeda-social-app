import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import { escapeRegex } from "@/utils/search";



export const ADMIN_COMMENTS_PAGE_SIZE = 10;



// q  ->  to handle 'searching' the users in users-table

// page -> we used 'skip' for pagination (not cursor)


export async function getAdminComments(page = 1, q?: string) {

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


   const [comments, totalComments] = await Promise.all(
      [
         CommentModel.find(filter)
            .sort({ _id: -1 })
            .skip((safePage - 1) * ADMIN_COMMENTS_PAGE_SIZE)
            .limit(ADMIN_COMMENTS_PAGE_SIZE)
            .populate("user", "-password")
            .populate("post", "_id")
            .lean()
         ,

         CommentModel.countDocuments(filter),
      ]
   );

   return {
      comments: JSON.parse(JSON.stringify(comments)),
      totalPages: Math.max(1, Math.ceil(totalComments / ADMIN_COMMENTS_PAGE_SIZE)),
      page: safePage,
   };
}