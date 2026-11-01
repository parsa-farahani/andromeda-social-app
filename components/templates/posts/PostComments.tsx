'use client';

import { Comment, User } from '@/types/mongooseTypes';
import CommentForm from './CommentForm';
import CommentCard from '@/components/modules/CommentCard/CommentCard';
import Modal from '@/components/modules/Modal/Modal';
import { useCallback, useEffect, useEffectEvent, useState } from 'react';
import { ArrowRightCircle, RefreshCcw, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { Spinner } from '@/components/ui/spinner';
import { useInView } from 'react-intersection-observer';


const PostComments = (
   {
      initialComments,
      initialCursor,
      postId,
      user,
      likedIds,
   }: {
      initialComments: Comment[];
      initialCursor: string | null;
      postId: string;
      user?: User;
      likedIds: string[];
   }
) => {


   const [isShowCommentModal, setIsShowCommentsModal] = useState(false);

   const handleCloseCommentModal = useCallback(() => {

      setIsShowCommentsModal(false);
   }, [])

   // const filteredComments = initialComments.filter((comment) => !comment?.parentComment);


   const [comments, setComments] = useState(initialComments);

   const [cursor, setCursor] = useState(initialCursor);

   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);

   const { inView, ref: infiniteScrollRef } = useInView();

   const handleLoadMore = async () => {

      if (!cursor || isLoading) return;
      
      setIsLoading(true);
      setIsError(false);

      try {
         const res = await fetch(`/api/posts/${postId}/comments?cursor=${cursor}`);

         if (res.status === 200) {

            const data: { comments: Comment[]; nextCursor: string | null } = await res.json();

            setComments(prev => {
               const ids = new Set(prev.map((c) => c._id));

               return [
                  ...prev,
                  ...data.comments.filter((c) => !ids.has(c._id))
               ]
            })

            setCursor(data.nextCursor)
         }
         else {
            throw new Error('Failed to Fetch Comments - Try Again');
         }
      } catch (error) {
         setIsError(true);
         toast.add(
            {
               type: 'error',
               title: error instanceof Error ? error.message : 'Failed to Fetch Comments - Try Again',
            }
         )
      }
      finally {
         setIsLoading(false);
      }
   }


   const handleInView = useEffectEvent(() => {
      handleLoadMore();
   })

   useEffect(() => {

      const checkInView = () => {
         if (inView) {
            handleInView();
         }
      }

      checkInView();
   }, [inView])

  return (
      <section className='mt-5' >

         <button
            onClick={() => setIsShowCommentsModal(true)}
            className='w-full rounded-full h-16 bg-white/8 border border-white/15 flex gap-5 items-center pl-7 pr-2'
         >  
            <span className='text-left text-gray-500 text-lg cursor-text grow' >
               Reply to this post...
            </span>

            <span className='p-3 bg-white/10 rounded-full text-white-900 ml-auto cursor-pointer border' >
               <SendHorizonal />
            </span>
         </button>
         
         <Modal
            isOpen={isShowCommentModal}
            onClose={handleCloseCommentModal}
            className="w-[600px]"
            >
            {isShowCommentModal && (
               <CommentForm
                  userId={user?._id}
                  postId={postId}
                  onComplete={handleCloseCommentModal}
               />
            )}
         </Modal>

         <div
            className='mt-10 pb-40'
         >
            {
               (comments && (comments.length > 0)) 
               ? (
                  <>
                     <ul>
                        {
                           comments.map((comment) => (
                              <li
                                 key={comment._id}
                              >
                                 <CommentCard
                                    comment={comment}
                                    postId={postId}
                                    depth={0}
                                    likedIds={likedIds}
                                 />
                              </li>
                           ))
                        }
                     </ul>

                     {
                        cursor && (
                           isError 
                           ? (
                              <div className="flex gap-3 items-center p-3 border border-white/10 rounded-md bg-red-500/10 justify-between" >
                                 <p>
                                    Failed to Fetch Comments
                                 </p>
                                 <Button className="cursor-pointer bg-background!" onClick={handleLoadMore} variant="outline">
                                    Retry
                                    <RefreshCcw className="size-3" />
                                 </Button>
                              </div>
                           ): (
                              <div
                                 className='flex-center py-2'
                                 ref={infiniteScrollRef}
                              >
                                 <Spinner className='size-6' />
                              </div>
                           )
                        )
                     }
                     {/* {
                        cursor && (
                           <Button
                              className="cursor-pointer border! border-gray-500/10 bg-transparent hover:bg-white/10 text-white"
                              disabled={isLoading}
                              onClick={handleLoadMore}
                           >
                              {
                                 isLoading
                                 ? "Loading..."
                                 : "Load More COmments"
                              }
                           </Button>
                        )
                     } */}
                  </>
               ): (
                  <p
                     className='mt-3 py-3 text-gray-500'
                  >
                     No comments Yet...
                  </p>
               )
            }
         </div>
      </section>
  )
}

export default PostComments