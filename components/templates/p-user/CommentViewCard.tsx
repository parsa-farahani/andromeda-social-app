"use client";

import Modal from "@/components/modules/Modal/Modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Comment } from "@/types/mongooseTypes";
import { Heart, MoreHorizontal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

const CommentViewCard = ({ comment }: { comment: Comment & { isLiked?: boolean } }) => {

   const [isShowImageModal, setIsShowImageModal] = useState(false);

   const handleCloseImageModal = useCallback(() => {
      setIsShowImageModal(false);
   }, []);



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

   return (
      <>
         <article
            className={`w-full flex flex-col p-5  border-b`}
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
                           className="rounded-lg overflow-clip h-70 aspect-3/4 border border-white/20 cursor-pointer bg-background"
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
                     <Modal
                        isOpen={isShowImageModal}
                        onClose={handleCloseImageModal}
                     >
                        <div className="relative max-md:px-3">
                           <button
                              className="absolute z-10 -top-10 right-5 md:-right-10 text-lg block"
                              onClick={handleCloseImageModal}
                           >
                              <X className="text-white size-6 cursor-pointer" />
                           </button>
                           <div className="relative overflow-clip rounded-lg h-fit max-h-[70vh] md:h-[70vh] border border-white/30 bg-background">
                              <Image
                                 src={comment.image}
                                 width={800}
                                 height={800}
                                 alt=""
                                 className="block size-full object-cover"
                              />
                           </div>
                        </div>
                     </Modal>
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

            <div className="w-full flex justify-end mt-5">
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
               

               <Link
                  href={`/posts/${comment.post}`}
                  className="rounded-full! cursor-pointer! text-blue-300 px-3 py-1 hover:bg-blue-400/10 transition text-sm flex items-center"
               >
                  View Post
               </Link>
            </div>
         </article>
      </>
   );
};

export default CommentViewCard;
