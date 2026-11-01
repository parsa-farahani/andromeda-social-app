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
      
      const { reason } = await req.json();

      
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

      if (user.role === 'ADMIN') {
         return NextResponse.json(
            { message: 'Forbidden' },
            {status: 403}
         )
      }

      if (user.isBanned) {
         return NextResponse.json({ message: "User is already banned" }, { status: 409 });
      }

      const banData = {
         user: user._id,
         admin: admin._id,
         reason: "",
      }

      if (
         reason &&
         typeof reason === 'string' &&
         reason.trim()
      ) {
         banData.reason = reason.trim();
      }

      const banDoc = await BanModel.create(
         banData,        
      )

      let updatedUser;

      try {
         
         updatedUser =  await UserModel.findOneAndUpdate(
            {
               _id: id,
            },
            {
               $set: {
                  isBanned: true,
               },
               $unset: {
                  refreshToken: "",
               },
            }
         )
      } catch (error) {
         await BanModel.deleteOne({ _id: banDoc._id });
         throw error;
      }

      if (!updatedUser) {
         return NextResponse.json(
            { message: 'Failed To ban User' },
            {status: 400}
         )
      }

      return NextResponse.json(
         { message: 'User Banned Successfully.' },
         {status: 201}
      )
      
   } catch (error) {

      console.log('🔴 Error -> ', error)
      
      return NextResponse.json(
         { message: 'Internal Server Error' },
         {status: 500}
      )
   }
}