import connectToDB from "@/configs/db";
import BanModel from "@/models/Ban";
import UserModel from "@/models/User";
import { authAdmin } from "@/utils/serverHelpers";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, { params }: { params: Promise<{id: string}> }) {
   

   try {

      await connectToDB();

      const admin = await authAdmin();

      if (!admin) {
         return NextResponse.json(
            { message: 'Forbidden' },
            {status: 403}
         )
      }

      const { id } = await params;

      
      if (!isValidObjectId(id)) {
         return NextResponse.json(
            { message: 'Invalid Data' },
            {status: 422}
         )
      }

      
      const user = await UserModel.findOne(
         {
            _id: id,
         }
      )


      if (!user) {
         return NextResponse.json(
            { message: 'Not Found' },
            {status: 404}
         )
      }


      if (!JSON.parse(JSON.stringify(user)).isBanned) {
         // console.log(user, user.isBanned)
         return NextResponse.json({ message: "User is not banned" }, { status: 409 });
      }



      const banDoc = await BanModel.findOneAndUpdate(
         { 
            user: user._id,
            liftedAt: { $exists: false },
         },
         {
            $set: {
               liftedAt: new Date(),
               liftedBy: admin._id,
            }
         }        
      )


      let updatedUser;

      try {
         
         updatedUser =  await UserModel.findOneAndUpdate(
            {
               _id: JSON.parse(JSON.stringify(user))._id,
            },
            {
               $set: {
                  isBanned: false,
               },
            }
         )
      } catch (error) {

         if (banDoc) {

            await BanModel.findOneAndUpdate(
               { _id: banDoc._id },
               {
                  $unset: {
                     liftedAt: "",
                     liftedBy: ""
                  }
               }
            );
         }

         throw error;
      }

      if (!updatedUser) {
         return NextResponse.json(
            { message: 'Failed To Lift the Ban' },
            {status: 400}
         )
      }

      return NextResponse.json(
         { message: 'Lifted the Ban Successfully.' },
         {status: 200}
      )
      
   } catch (error) {

      console.log('🔴 Error -> ', error)
      
      return NextResponse.json(
         { message: 'Internal Server Error' },
         {status: 500}
      )
   }
}