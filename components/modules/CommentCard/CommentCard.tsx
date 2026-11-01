"use client";

import { Button } from "@/components/ui/button";
import { Comment } from "@/types/mongooseTypes";
import { ChevronDown, ChevronUp, Heart, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import Modal from "../Modal/Modal";
import CommentForm from "@/components/templates/posts/CommentForm";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import { MAX_REPLY_DEPTH } from "@/utils/constants";
import MediaModal from "../MediaModal/MediaModal";
import { useRouter } from "next/navigation";

interface CommentCardProps {
   comment: Comment & {
      isLiked?: boolean;
   };
   postId: string;
   depth: number;
   likedIds: string[];
}

const CommentCard = ({ comment, postId, depth, likedIds }: CommentCardProps) => {
   const indent = depth + 1;

   const [isShowImageModal, setIsShowImageModal] = useState(false);

   const handleCloseImageModal = useCallback(() => {
      setIsShowImageModal(false);
   }, []);

   const [isShowReplyModal, setIsShowReplyModal] = useState(false);

   const handleCloseReplyModal = useCallback(() => {
      setIsShowReplyModal(false);
   }, []);

   const [isShowReplies, setIsShowReplies] = useState(false);
   const [replies, setReplies] = useState<Comment[]>([]);

   const [isLoadingReplies, setIsLoadingReplies] = useState(false);

   const [hasReply, setHasReply] = useState(comment.hasReply);


   const loadReplies = async () => {
      try {
         setIsLoadingReplies(true);

         const res = await fetch(`/api/comments/${comment._id}/replies`);

         if (res.status === 200) {
            const data: Comment[] = await res.json();
            const dataWithLiked = data.map((r) => ({ ...r, isLiked: likedIds.includes(String(r._id)) }));
            setReplies(dataWithLiked);
         } else {
            toast.add({
               type: "error",
               title: "Error Loading Replies",
            });
         }
      } catch (error) {
         console.log("🔴 Error - loadReplies: ", error);

         toast.add({
            type: "error",
            title: "Error Loading Replies",
         });
      } finally {
         setIsLoadingReplies(false);
      }
   };

   const handleShowReplies = () => {
      setIsShowReplies(true);
      loadReplies();
   };

   const handleHideReplies = () => {
      setIsShowReplies(false);
   };


   const handleAddReplyComplete = () => {

      handleCloseReplyModal();
      loadReplies();
      setHasReply(true);
      setIsShowReplies(true);
   }


   const router = useRouter();

   const [liked, setLiked] = useState(comment.isLiked ?? false);
   const [count, setCount] = useState(comment.likesCount ?? 0);

   const handleLike = async () => {

      const next = !liked;

      setLiked(next);
      setCount(c => Math.max(0, c + (next ? 1 : -1)));

      try {
         const res = await fetch(`/api/likes/comment`, {
            method: next ? "POST" : "DELETE",
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentId: comment._id })
         });

         if (res.status === 201) {
            toast.add({
               type: "success",
               title: "Comment Like is updated Successfully.",
            });

            router.refresh();
         } else if (res.status === 422) {
            throw new Error("Failed to update Like - Invalid Data")
         } else if (res.status === 401) {
            throw new Error("Failed to update Like - Unauthorized")
         } else if (res.status === 409) {
            throw new Error("Already liked");
         } else {
            throw new Error("Failed to update Like");
         }
      } catch (error) {

         setLiked(!next);
         setCount(c => Math.max(0, c + (next ? -1 : 1)));

         console.log("🔴 Error - handle-like -> ", error);

         toast.add({
            type: "error",
            title: error instanceof Error ? error?.message : "Failed to update Like - Unknown Error",
         });
      }
   }

   console.log(replies);

   return (
      <>
         <article
            className={`w-full flex flex-col  mt-3 mb-2  ${!comment.parentComment ? "border-b" : ""}`}
         >
            <header className="w-full mb-4">
               <div className="flex gap-5 items-start w-full">
                  <div className="size-8 rounded-full overflow-clip">
                     <Image
                        src={comment.user?.avatar ?? "/images/users/avatar.png"}
                        width={100}
                        height={100}
                        alt="user avatar"
                     />
                  </div>

                  <p className="font-semibold text-sm pt-1">
                     {comment.user?.username}
                  </p>

                  <p className="">
                     <time className="ml-auto text-mauve-400/60 text-[.65rem]">
                        {new Date(comment.createdAt ?? 0).toLocaleDateString(
                           "en-US",
                        )}
                     </time>
                  </p>

                  <button className="border border-[#ffffff00] hover:border-gray-600 rounded-full p-1 ml-auto cursor-pointer transition">
                     <MoreHorizontal className="size-5" />
                  </button>
               </div>
            </header>

            <main>
               {comment?.image ? (
                  <>
                     <div className="mb-5">
                        <div
                           className="rounded-lg overflow-clip h-50 aspect-3/4 border border-white/20 cursor-pointer bg-background"
                           aria-haspopup
                           onClick={() => setIsShowImageModal(true)}
                        >
                           <Image
                              src={comment.image}
                              width={400}
                              height={400}
                              alt={comment.title}
                              className="block size-full object-cover"
                           />
                        </div>
                     </div>
                     <MediaModal
                        isOpen={isShowImageModal}
                        onClose={handleCloseImageModal}
                        src={comment.image}
                        mediaType="image"
                     />
                     
                  </>
               ) : null}

               <h3 className="pt-3 px-3">{comment.title}</h3>

               {comment.tags && comment.tags.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                     {comment.tags.map((tag) => (
                        <Link
                           key={tag}
                           href={`/search?tag=${tag}`}
                           className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm"
                        >
                           #{tag}
                        </Link>
                     ))}
                  </div>
               ) : null}
            </main>

            <div className="w-full flex justify-end mt-5 pb-2">
               {hasReply && !isShowReplies ? (
                  <Button
                     variant="ghost"
                     className="rounded-full! cursor-pointer! mr-auto text-sm! text-blue-300 mb-2"
                     onClick={handleShowReplies}
                  >
                     Show Replies <ChevronDown />
                  </Button>
               ) : null}

               <Button
                  variant="ghost"
                  className={`rounded-full! cursor-pointer! ${liked ? "text-[hotpink] hover:text-[hotpink]" : ""}`}
                  onClick={() => handleLike()}
               >
                  <span className="text-sm" >
                     {count}
                  </span>
                  <Heart fill={liked ? "hotpink" : ""} />
               </Button>

               <Button
                  variant="ghost"
                  className="rounded-full! cursor-pointer! text-blue-300 px-3 py-1 hover:bg-blue-400/10 transition"
                  aria-haspopup
                  onClick={() => setIsShowReplyModal(true)}
               >
                  Reply
               </Button>
            </div>

            {isLoadingReplies ? (
               <div className="flex items-center justify-center py-2">
                  <Spinner className="size-5" />
               </div>
            ) : isShowReplies && replies && replies.length > 0 ? (
               <div
                  className={`pt-3  ${depth < MAX_REPLY_DEPTH ? "pl-5 border-l" : ""}`}
               >
                  <ul>
                     {replies.map((reply) => (
                        <li key={reply._id}>
                           <CommentCard
                              comment={reply}
                              postId={postId}
                              depth={indent}
                              likedIds={likedIds}
                           />
                        </li>
                     ))}
                  </ul>
                  {hasReply && isShowReplies ? (
                     <Button
                        variant="ghost"
                        className="rounded-full! cursor-pointer! mr-auto text-sm! text-blue-300 mb-3"
                        onClick={handleHideReplies}
                     >
                        Hide Replies <ChevronUp />
                     </Button>
                  ) : null}
               </div>
            ) : null}
         </article>

         <Modal
            isOpen={isShowReplyModal}
            onClose={handleCloseReplyModal}
            className="w-[600px]"
         >
            {
               isShowReplyModal &&
               ( 
                  <CommentForm
                     userId={comment.user?._id}
                     postId={postId}
                     parentCommentId={comment._id}
                     onComplete={handleAddReplyComplete}
                  />
               )
            }
         </Modal>
      </>
   );
};

export default CommentCard;
