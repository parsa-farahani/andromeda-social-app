import mongoose, { InferSchemaType } from "mongoose";


const schema = new mongoose.Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
      },
      phone: {
         type: String,
         required: false,
      },
      password: {
         type: String,
         required: true,
      },
      avatar: {  // src
         type: String,
         required: false,
      },
      role: {
         type: String,
         enum: ['USER', 'ADMIN'],
         default: 'USER',
      },
      refreshToken: {
         type: String,
      },
      isBanned: {
         type: Boolean,
         default: false,
      }
   }
)


type User = InferSchemaType<typeof schema>

const UserModel = mongoose.models?.User || mongoose.model<User>('User', schema);


export default UserModel;