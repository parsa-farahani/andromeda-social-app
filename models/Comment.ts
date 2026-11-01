import mongoose, { InferSchemaType } from "mongoose";
import PostModel from '@/models/Post'
import UserModel from '@/models/User'
import PostComments from "@/components/templates/posts/PostComments";

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

      likesCount: {
         type: Number,
         default: 0,
         min: 0
      },
      
      user: {
         type: mongoose.Types.ObjectId,
         ref: 'User',
         requried: true,
      },

      post: {
         type: mongoose.Types.ObjectId,
         ref: "Post",
         required: true,
      },

      // replies to this comment are saved here
      comments: {
         type: [
            {
               type: mongoose.Types.ObjectId,
               ref: "Comment",
            }
         ],
      },

      // This is an 'optional field', if this comment is a 'reply' to another comment , this field refers to that post's Id
      parentComment: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment",
         default: null,
      },

      // in parent-comment, which has replies, we set this field to 'true'
      hasReply: {
         type: Boolean,
         default: false,
      }
   },
   {
      timestamps: true
   }
)


type Comment = InferSchemaType<typeof schema>

const CommentModel = mongoose.models?.Comment || mongoose.model<Comment>('Comment', schema);


export default CommentModel;