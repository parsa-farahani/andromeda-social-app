import mongoose, { InferSchemaType } from "mongoose";
import UserModel from '@/models/User'
import PostModel from '@/models/Post'

const schema = new mongoose.Schema(
   {
      
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         requried: true,
      },
      
      post: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Post',
         requried: true,
      },
   },
   {
      timestamps: true
   }
)

// to make sure that each user can like a post 'only once'
// we use this combinational index as 'unique' index
// also it helps to find 'if this user liked this post?' later
schema.index({ user: 1, post: 1 }, { unique: true });

// this index is added for the page '/p-user/likes'
// it keeps the posts , grouped by 'user' field (posts of each user in his group)
// and also with '_id: -1', it keeps those posts 'sorted' from newest to oldest
schema.index({ user: 1, _id: -1 });



type Like = InferSchemaType<typeof schema>


const LikeModel = mongoose.models?.Like || mongoose.model<Like>('Like', schema);


export default LikeModel;