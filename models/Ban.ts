import mongoose, { InferSchemaType } from "mongoose";
import UserModel from '@/models/User'

const schema = new mongoose.Schema(
   {
      
      user: {
         type: mongoose.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      
      admin: {
         type: mongoose.Types.ObjectId,
         ref: 'User',
         required: true,
      },

      reason: {
         type: String,
         trim: true,
         maxLength: 300,
      },
      
      liftedAt: {
         type: Date,
      },

      liftedBy: { 
         type: mongoose.Types.ObjectId,
         ref: "User",
      },
   },
   {
      timestamps: true
   }
)


type Ban = InferSchemaType<typeof schema>


const BanModel = mongoose.models?.Ban || mongoose.model<Ban>('Ban', schema);


export default BanModel;