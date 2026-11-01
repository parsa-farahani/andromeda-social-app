'use client'

import { createComment } from '@/actions/comment';
import MediaModal from '@/components/modules/MediaModal/MediaModal';
import Modal from '@/components/modules/Modal/Modal';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { MAX_TAG_LENGTH, MAX_TAGS } from '@/utils/constants';
import { commentSchema, CommentSchema } from '@/utils/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ImageDownIcon, SendHorizonal } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useActionState, useCallback, useEffect, useEffectEvent, useId, useState, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form';

interface CommentFormProps {
   postId: string;
   userId?: string;
   parentCommentId?: string;
   onComplete?: () => void;
}


const CommentForm = (
   {
      userId,
      postId,
      parentCommentId,
      onComplete,
   }: CommentFormProps
) => {


   const {
      reset,
      control,
      setValue,
      getValues,
      register,
      handleSubmit,
      formState: { errors, isSubmitting },

   } = useForm<CommentSchema>(
      {
         resolver: zodResolver(commentSchema),
         defaultValues: {
            title: "",
            user: userId,
            post: postId,
            parentComment: parentCommentId,
            image: undefined,
            tags: [] as string[],
         }
      }
   )

   const tags = useWatch({
      control,
      name: "tags",
   });
   const [tagValue, setTagValue] = useState("");

   const [imagePreview, setImagePreview] = useState<string | null>(null);
   const [isShowImagePreviewModal, setIsShowImagePreviewModal] = useState(false);

   const handleCloseImagePreviewModal = useCallback(() => {
      setIsShowImagePreviewModal(false);
   }, [])



   const handleShowImagePreview = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      // Shows a preview of chosen-images in post-input area

      const file = event.target.files?.[0];

      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setIsShowImagePreviewModal(false);
   }




   const handleAddTag = () => {

      const normalizedtag = tagValue.trim().replace(/^#+/, "");

      if (!normalizedtag) return;

      if (normalizedtag.length > MAX_TAG_LENGTH) return;

      const currentTags = getValues("tags");


      const alreadyExists = currentTags.some(tag => tag.toLowerCase() === normalizedtag.toLowerCase())

      if (alreadyExists || currentTags.length > MAX_TAGS) return;


      setValue(
         "tags",
         [...currentTags, normalizedtag],
         {
            shouldDirty: true,
            shouldValidate: true,
         }
      );

      setTagValue("");
   }

   const handleRemoveTag = (tagToRemove: string) => {

      const currentTags = getValues("tags");

      setValue(
         "tags",
         currentTags.filter((tag) => tag.toLowerCase() !== tagToRemove.toLowerCase()),
         {
            shouldDirty: true,
            shouldValidate: true,
         }
      )
   }


   const [isPendingCreateComment, startTransition] = useTransition();


   const handleComplete = () => {
      setValue('title', "");
      setValue('image', undefined);
      setValue('tags', []);

      router.refresh();

      if (onComplete) {   
         onComplete();
      }
   }


   const router = useRouter();

   const handleCreateComment = async (values: CommentSchema) => {


      if (!userId) {
         toast.add(
            {
               type: 'info',
               title: 'You must sign-in to post comments.'
            }
         )

         return;
      }

      const formData = new FormData();

      formData.set("title", values.title);

      formData.set("user", values.user);

      formData.set("post", values.post);

      if (values?.parentComment) {
         formData.set("parentComment", values.parentComment);
      }

      formData.set("tags", JSON.stringify(values.tags ?? []));

      const imageFile = values?.image?.[0];

      if (imageFile) {
         formData.set("image", imageFile);
      }

      startTransition(async () => {
         // createCommentAction(formData);

         try {

            const result = await createComment(formData);

            if (result.isSuccess) {
               toast.add(
                  {
                     type: 'success',
                     title: 'Comment is created successfully',
                  }
               )

               handleComplete();
            }
            else if (result.error) {
               throw new Error(result.error);
            }
            else {
               throw new Error("Unknown Error");
            }
            
         } catch (error) {
            
            toast.add(
               {
                  type: 'error',
                  title: `Failed to Create the Comment !! - ${error}`,
               }
            )
         }
      })
   }

   const handleRemoveImage = () => {
      
      
      setValue('image', undefined);

      if (imagePreview) {
         URL.revokeObjectURL(imagePreview);
         setImagePreview(null);
      }

      setIsShowImagePreviewModal(false);
   }


   const imageInpId = useId();


   const titleInpId = useId();

  return (
      <form
         onSubmit={handleSubmit(handleCreateComment)}
      >
            <div
               className='relative min-h-30 h-auto bg-[#151515] rounded-lg border scrollbar p-3'
            >

               {/* Images Preview  */}
               {
                  imagePreview && (!errors.image)
                  ? (
                     <div
                        className='flex mb-5'
                     >
                        <div
                           className='relative rounded-lg overflow-clip h-50 aspect-3/4 border border-userwhite/20 cursor-pointer'
                           onClick={() => setIsShowImagePreviewModal(true)}
                        >
                           <button
                              type="button"
                              onClick={() => handleRemoveImage()}
                              className="absolute top-2 right-2 bg-white/20 size-7 text-lg rounded-full hover:bg-white/30 cursor-pointer transition backdrop-blur-lg"
                           >
                              ×
                           </button>
                           <Image
                              src={imagePreview}
                              width={400}
                              height={400}
                              alt=""
                              className='block size-full object-cover'
                           />
                        </div>

                        <MediaModal
                           isOpen={isShowImagePreviewModal}
                           onClose={handleCloseImagePreviewModal}
                           src={imagePreview}
                           mediaType="image"
                        />
                     </div>
                  ): null
               }

               {/* User Id  */}
               <input type="hidden" {...register('user')} />

               {/* Post Id  */}
               <input type="hidden" {...register('post')} />

               {/* Parent-Comment Id  */}
               <input type="hidden" {...register('parentComment')} />


               {/* text field  */}
               <Field>
                  <Textarea
                     id={titleInpId}
                     placeholder={parentCommentId ? "Reply to comment..." : "Reply to author ..."}
                     className="text-lg! h-full min-h-10! px-4 bg-transparent! border-0! inset-0 resize-none focus-visible:ring-0"
                     {...register('title')}
                     aria-invalid={!!errors.title}
                     disabled={isSubmitting || isPendingCreateComment}
                  />

                  {
                     errors.title && (
                        <FieldError>
                           {errors.title?.message}
                        </FieldError>
                     )
                  }
               </Field>


               <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                     <span
                     key={tag}
                     className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm"
                     >
                     #{tag}

                     <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        aria-label={`Remove ${tag}`}
                        className="text-muted-foreground hover:text-white"
                     >
                        ×
                     </button>
                     </span>
                  ))}
               </div>

               <div className='mt-4 flex items-center gap-5' >

                  <div className="mr-auto">

                     <div className="flex gap-2">
                        <Input
                           value={tagValue}
                           onChange={(event) => setTagValue(event.target.value)}
                           onKeyDown={(event) => {
                           if (event.key === "Enter") {
                              event.preventDefault();
                              handleAddTag();
                           }
                           }}
                           placeholder="Add a tag..."
                           maxLength={MAX_TAG_LENGTH}
                           disabled={tags.length >= MAX_TAGS || isSubmitting || isPendingCreateComment}
                        />

                        <Button
                           type="button"
                           variant="outline"
                           onClick={handleAddTag}
                           disabled={!tagValue.trim() || tags.length >= MAX_TAGS || isSubmitting || isPendingCreateComment}
                        >
                           Add
                        </Button>
                     </div>

                     {errors.tags && (
                        <p className="text-sm text-destructive">
                           {errors.tags.message}
                        </p>
                     )}
                  </div>

               

                  <div className='flex justify-end gap-3 h-fit' >

                     <Field className="flex! items-center!" >
                        <FieldLabel
                           className={`text-xl cursor-pointer  rounded-full overflow-clip hover:bg-white/10 w-fit p-2 transition aspect-square! flex items-center! justify-center! ${isPendingCreateComment ? "pointer-events-none opacity-60" : ""}`}

                           htmlFor={imageInpId}
                        >
                           <ImageDownIcon className='size-5' />
                        </FieldLabel>
                        <Input
                           type="file"
                           id={imageInpId}
                           className="sr-only"
                           {...register("image", {
                              onChange: handleShowImagePreview,
                           })}
                           aria-invalid={!!errors.image}
                           disabled={isPendingCreateComment}
                        />
                     </Field>

                     <Button  
                        className="w-fit! text-lg! px-3 py-5 cursor-pointer rounded-full aspect-square!"
                        type='submit'
                        disabled={isPendingCreateComment}
                     >
                        <SendHorizonal className='size-5' />
                     </Button>
                  </div>
               </div>

            </div>
         </form>
  )
}

export default CommentForm