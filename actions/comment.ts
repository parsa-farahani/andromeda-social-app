'use server'

import connectToDB from "@/configs/db";
import CommentModel from "@/models/Comment";
import PostModel from "@/models/Post";
import { detectImage, safeFileName } from "@/utils/media/upload";
import { authUser } from "@/utils/serverHelpers";
import { commentActionSchema } from "@/utils/validations";
import { mkdir, writeFile } from "fs/promises";
import { isValidObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import path from "path";

export type CreateCommentState = {
  error: string | null;
  isSuccess: boolean;
};



// export const createComment = async  (prevState: CreateCommentState, formData: FormData): Promise<CreateCommentState> => {

export const createComment = async  (formData: FormData): Promise<CreateCommentState> => {

   try {

      const authenticatedUser = await authUser();

      if (!authenticatedUser || !authenticatedUser?._id) {
         return { error: "You must sign in to post comments.", isSuccess: false };
      }

      const user = authenticatedUser._id;

      const title = formData.get('title');
      // const user = formData.get('user');
      const post = formData.get('post');
      const parentCommentValue = formData.get('parentComment');
      const parentComment = parentCommentValue ?? undefined;

      //  console.log('🟣 parentId: ', parentComment)
      //  console.log('🟣 postId: ', post)
      // console.log('🟣 userId: ', user)

      const imageValue = formData.get('image');

      const image =
         imageValue instanceof File && imageValue.size > 0
         ? imageValue
         : undefined;

      const strTags = formData.get('tags');
      
      let tags = [];

      if (typeof strTags === "string") {
         try {
            tags = JSON.parse(strTags);
         } catch {
            return {
               error: "Invalid tags format",
               isSuccess: false,
            };
         }
      }


      const validationResult = commentActionSchema.safeParse(
         {
            title,
            image,
            user,
            post,
            parentComment,
            tags,
         }
      )

      if (!validationResult.success) {

         console.log('🔴 validation Eror - createPost action: ', validationResult.error.flatten());

         return {
            error: validationResult.error.issues[0]?.message
               ?? "Please check your input and try again.",
            isSuccess: false,
         }
      }

      const {
         title: validatedTitle,
         user: validatedUser,
         post: validatedPost,
         parentComment: validatedParentComment,
         tags: validatedTags,
         image: validatedImage,
      } = validationResult.data;

      if (!isValidObjectId(validatedUser)) {
         return {
            error: "Invalid User",
            isSuccess: false,
         }
      }

      if (!isValidObjectId(validatedPost)) {
         return {
            error: "Invalid Post",
            isSuccess: false,
         }
      }

      if (validatedParentComment) {
         
         if (!isValidObjectId(validatedParentComment)) {
            return {
               error: "Invalid Comment to Reply",
               isSuccess: false,
            }
         }
      }

      // Check if already such post exists (with same 'title'), dont create it again
      const isCommentExist = await CommentModel.findOne(
         {
            title: validatedTitle,
            user: validatedUser,
            post: validatedPost,
         }
      )

      if (isCommentExist) {
         return {
            error: "A comment with this title already exists.",
            isSuccess: false,
         }
      }


      // save image to files
      let imagePath = "";

      if (validatedImage instanceof File && validatedImage.size > 0) {

         const buffer = Buffer.from(await validatedImage.arrayBuffer());

         const ext = detectImage(buffer);
         
         if (!ext) {
            return {
               error: 'Ivalid Data - Invalid Image File',
               isSuccess: false,
            }
         }
         
         const fileName = safeFileName(ext);
         
         const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
         
         const dirPath = path.join(UPLOAD_ROOT, "users");       

         await mkdir(dirPath, { recursive: true });

         await writeFile(path.join(dirPath, fileName), buffer);

         imagePath = `/api/files/users/${fileName}`; 

         // const dirPath = path.join( process.cwd(), 'public', 'images', 'posts', 'comments' );
         
         // await mkdir(dirPath, { recursive: true });
         

         // const filePath = path.join(dirPath, fileName);



         // await writeFile(filePath, buffer);

         // imagePath = `/images/posts/comments/${fileName}`;
      }


      const commentData = {
         title: validatedTitle,
         user: validatedUser,
         post: validatedPost,
         tags: validatedTags,
         ...(imagePath ? { image: imagePath } : {}),
         ...(validatedParentComment ? {parentComment: validatedParentComment} : {}),
      }


      await connectToDB();

      const createdComment = await CommentModel.create(
         commentData
      )
      
      // add comment in 'comments' field of corresponding post

      const updatedPost = await PostModel.findOneAndUpdate(
         {
            _id: validatedPost,
         },
         {
            $push: {
               comments: createdComment._id,
            }
         }
      )

      if (validatedParentComment) {

         await CommentModel.findOneAndUpdate(
            {
               _id: validatedParentComment,
            },
            {
               $set: {
                  hasReply: true,
               },
               $push: {
                  comments: createdComment._id,
               }
            }
         )
      }

      revalidatePath(`/posts/${validatedPost}`);

      return {
         error: null,
         isSuccess: true,
      }
      
   } catch (error) {
      
      console.log('🔴 Error - createComment -> ', error);

      return {
         error: "Failed to post the comment. Please try again.",
         isSuccess: false,
      }
   }
}