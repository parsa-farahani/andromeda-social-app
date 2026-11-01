import { cookies } from "next/headers"
import { verifyAccessToken } from "./auth";
import UserModel from "@/models/User";
import connectToDB from "@/configs/db";
import { roles } from "./constants";
import { cache } from "react";

const authUser = cache(async () => {

   const cookeStore = await cookies();
   try {
      
      const token = cookeStore.get('token')?.value;
   
      if (!token) return null;
   
      const tokenPayload = verifyAccessToken(token);

      if (!tokenPayload) return null;

      const { email } = tokenPayload;

      await connectToDB();
      
      const user = await UserModel.findOne(
         {
            email,
         },
         "-password"
      )

      if (
         !user ||
         user?.isBanned
      ) {
         return null;
      }

      return JSON.parse(JSON.stringify(user));
      
   } catch (error: unknown) {
      console.log(`🔴 Error - authUser -> ${(error instanceof Error) ? error?.message : error}`);
      return null;
   }
})


const authAdmin = cache(async () => {

   const cookeStore = await cookies();
   try {
      
      const token = cookeStore.get('token')?.value;
   
      if (!token) return null;
   
      const tokenPayload = verifyAccessToken(token);

      if (!tokenPayload) return null;

      const { email } = tokenPayload;

      await connectToDB();
      
      const user = await UserModel.findOne(
         {
            email,
         },
         "-password"
      )

      if (
         !user ||
         user?.role !== roles.ADMIN
      ) {
         return null;
      }

      return JSON.parse(JSON.stringify(user));
      
   } catch (error: unknown) {
      console.log(`🔴 Error - authAdmin -> ${(error instanceof Error) ? error?.message : error}`);
      return null;
   }
})



export {
   authUser,
   authAdmin,
}