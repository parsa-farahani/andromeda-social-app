import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import mongoose from "mongoose";


// Whenever we want to delete a 'post' or 'comment' -> we must delete all of 'comments-replies' tree
// for that post. so we use this function in 'APIs', when we want to delete a 'post' or 'comment', to get all of
// reply-tree ids and images to remove all of them

export async function collectCommentDescendants(rootId: mongoose.Types.ObjectId) {

   let currentParents = [
      rootId,
   ]

   const commentIds: mongoose.Types.ObjectId[] = [];
   const commentImages: string[] = [];

   await connectToDB();

   while(currentParents.length) {

      const childComments = await CommentModel.find(
         {
            parentComment: {
               $in: currentParents,
            },
         },
         "_id image"
      )
      .lean();


      currentParents = childComments.map((child) => child._id);      

      commentIds.push(...currentParents);
         
      childComments.forEach((child) => {
         if (child.image) {
            commentImages.push(child.image);
         }
      })
   }


   return { ids: commentIds, images: commentImages };
}


export const isDuplicateKeyError = (error: unknown): boolean =>
   typeof error === "object" &&
   error !== null &&
   "code" in error &&
   (error as { code?: unknown }).code === 11000;