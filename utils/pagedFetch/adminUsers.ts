import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import { escapeRegex } from "@/utils/search";



export const ADMIN_USERS_PAGE_SIZE = 10;



// q  ->  to handle 'searching' the users in users-table

// page -> we used 'skip' for pagination (not cursor)


export async function getAdminUsers(page = 1, q?: string) {

   await connectToDB();

   const filter: Record<string, unknown> = {};

   const term = q?.trim().slice(0, 50);

   if (term) {

      const regex = {
         $regex: escapeRegex(term),
         $options: "i"
      };

      filter.$or = [
         { username: regex },
         { email: regex }
      ];
   }


   const safePage = Math.max(1, Math.floor(page) || 1);


   const [users, totalUsers] = await Promise.all(
      [
         UserModel.find(filter, "-password")
            .sort({ _id: -1 })
            .skip((safePage - 1) * ADMIN_USERS_PAGE_SIZE)
            .limit(ADMIN_USERS_PAGE_SIZE)
            .lean()
         ,

         UserModel.countDocuments(filter),
      ]
   );

   return {
      users: JSON.parse(JSON.stringify(users)),
      totalPages: Math.max(1, Math.ceil(totalUsers / ADMIN_USERS_PAGE_SIZE)),
      page: safePage,
   };
}