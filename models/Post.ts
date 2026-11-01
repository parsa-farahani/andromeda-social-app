import mongoose, { InferSchemaType } from "mongoose";
import UserModel from '@/models/User'
import CommentModel from '@/models/Comment'

const schema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
      },
      
      image: {
         type: String,    // image-src
         required: false,
      },

      tags: {
         type: [String],
         default: [],
      },
      
      user: {
         type: mongoose.Types.ObjectId,
         ref: 'User',
         requried: true,
      },

      comments: {
         type: [
            {
               type: mongoose.Types.ObjectId,
               ref: "Comment",
            }
         ],
      },

      likesCount: {
         type: Number,
         default: 0,
         min: 0
      },
   },
   {
      timestamps: true
   }
)


type Post = InferSchemaType<typeof schema>


const PostModel = mongoose.models?.Post || mongoose.model<Post>('Post', schema);


export default PostModel;