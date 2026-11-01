'use client'
import { createPost } from '@/actions/post'
import Modal from '@/components/modules/Modal/Modal'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { User } from '@/types/mongooseTypes'
import { MAX_TAG_LENGTH, MAX_TAGS } from '@/utils/constants'
import { postSchema, PostSchema } from '@/utils/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, ImageDownIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'





const CreatePostForm = (
   {
      user,
      onComplete,
   }: {
      user: User;
      onComplete?: () => void;
   }
) => {

   const router = useRouter();

   const {
      control,
      setValue,
      getValues,
      register,
      handleSubmit,
      formState: { errors, isSubmitting },

   } = useForm<PostSchema>(
      {
         resolver: zodResolver(postSchema),
         defaultValues: {
            title: "",
            user: user._id,
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


   const [isPending, startTransition] = useTransition();

   // const [createPostState, createPostAction, isPendingCreatePost] = useActionState(createPost, 
   //    {
   //       error: null,
   //       isSuccess: false,
   //    }
   // );

   
 
   const handleComplete = () => {
      if (onComplete && typeof onComplete === 'function') {
         onComplete();
      }

      setValue("title", "");
      setValue("image", undefined);
      setValue("tags", []);
   
      router.push('/p-user');
   }



   const handleCreatePost = async (values: PostSchema) => {


      const formData = new FormData();

      formData.set("title", values.title);

      formData.set("user", values.user);

      formData.set("tags", JSON.stringify(values.tags ?? []));

      const imageFile = values?.image?.[0];

      if (imageFile) {
         formData.set("image", imageFile);
      }

      // startTransition(() => {
      //    createPostAction(formData);
      // })

      startTransition(async () => {
         // createCommentAction(formData);

         try {

            const result = await createPost(formData);

            if (result.isSuccess) {
               toast.add(
                  {
                     type: 'success',
                     title: 'Post is created successfully',
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
                  title: `Failed to Create the Post !! - ${error}`,
               }
            )
         }
      })
   }

   const handleRemoveImage = () => {

      setValue('image', undefined)
      setImagePreview(null);
      setIsShowImagePreviewModal(false);
   }

  return (
    <div className='pt-5' >
         <form
            onSubmit={handleSubmit(handleCreatePost)}
         >
            <div
               className='relative min-h-50 h-auto bg-[#151515] rounded-lg border scrollbar p-5'
            >

               {/* Images Preview  */}
               {
                  imagePreview && (!errors.image)
                  ? (
                     <div
                        className='flex mb-5'
                     >
                        <div
                           className='relative rounded-lg overflow-clip h-50 aspect-3/4 border border-white/20 cursor-pointer'
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

                        <Modal
                           isOpen={isShowImagePreviewModal}
                           onClose={handleCloseImagePreviewModal}
                        >
                           <div
                              className='overflow-clip rounded-lg w-auto h-[70vh] border border-white/30'
                           >
                              <Image
                                 src={imagePreview}
                                 width={400}
                                 height={400}
                                 alt=""
                                 className='block size-full object-cover'
                              />
                           </div>
                        </Modal>
                     </div>
                  ): null
               }

               {/* User Id  */}
               <input type="hidden" {...register('user')} />


               {/* text field  */}
               <Textarea
                  id="textarea-message" 
                  placeholder="Whats in your mind? ..."
                  className="text-lg! h-full min-h-30! px-4 bg-transparent! border-0! inset-0 resize-none focus-visible:ring-0"
                  {...register('title')}
                  aria-invalid={!!errors.title}
                  disabled={isPending}
               />


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
                           disabled={tags.length >= MAX_TAGS || isSubmitting || isPending}
                        />

                        <Button
                           type="button"
                           variant="outline"
                           onClick={handleAddTag}
                           disabled={!tagValue.trim() || tags.length >= MAX_TAGS || isSubmitting || isPending}
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
                           className={`text-xl cursor-pointer block  rounded-full overflow-clip hover:bg-white/10 size-10 p-2 transition ${isPending ? 'pointer-events-none opacity-60' : ''}`}
                           htmlFor="fieldgroup-image"
                        >
                           <ImageDownIcon />
                        </FieldLabel>
                        <Input
                           type="file"
                           id="fieldgroup-image"
                           className="sr-only"
                           {...register("image", {
                              onChange: handleShowImagePreview,
                           })}
                           aria-invalid={!!errors.image}
                           disabled={isPending}
                        />

                     </Field>

                     <Button  
                        className="w-fit! text-lg! px-3 py-5 cursor-pointer"
                        type='submit'
                        disabled={isPending}
                     >
                        {
                           (isPending)
                           ? (
                              <span>
                                 Creating...
                              </span>
                           ): (
                              <>
                                 Post <ArrowRight />
                              </>
                           )
                        }
                     </Button>
                  </div>
               </div>

            </div>
         </form>
      </div>
  )
}

export default CreatePostForm