"use client";

import { Button } from "@/components/ui/button";
import { Post } from "@/types/mongooseTypes";
import {
   Heart,
   MoreHorizontal,
   Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import Modal from "../Modal/Modal";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import MediaModal from "../MediaModal/MediaModal";

interface PostCardProps {
   post: Post & {
      isLiked: boolean;
   };
   hasDelete?: boolean;
}

const PostCard = ({ post, hasDelete }: PostCardProps) => {

   const router = useRouter();

   const [isShowImageModal, setIsShowImageModal] = useState(false);

   const handleCloseImageModal = useCallback(() => {
      setIsShowImageModal(false);
   }, []);

   const handleDeletePost = async () => {
      try {
         const res = await fetch(`/api/posts/${post._id}`, {
            method: "DELETE",
         });

         if (res.status === 200) {
            toast.add({
               type: "success",
               title: "Post is Deleted Successfully.",
            });

            router.refresh();
         } else if (res.status === 422) {
            toast.add({
               type: "error",
               title: "Failed to Deleted Post - Invalid Data",
            });
         } else if (res.status === 401) {
            toast.add({
               type: "error",
               title: "Failed to Deleted Post - Unauthorized",
            });
         } else {
            toast.add({
               type: "error",
               title: "Failed to Deleted Post",
            });
         }
      } catch (error) {
         console.log("🔴 Error - deletePost -> ", error);

         toast.add({
            type: "error",
            title: "Failed to Deleted Post",
         });
      }
   };


   
   const [liked, setLiked] = useState(post.isLiked ?? false);
   const [count, setCount] = useState(post.likesCount ?? 0);



   const handleLike = async () => {

      const next = !liked;

      setLiked(next);
      setCount(c => Math.max(0, c + (next ? 1 : -1)));

      try {
         const res = await fetch(`/api/likes`, {
            method: next ? "POST" : "DELETE",
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId: post._id })
         });

         if (res.status === 201) {
            toast.add({
               type: "success",
               title: "Post Like is updated Successfully.",
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
      <article className="w-full flex flex-col ">
         <header className="w-full mb-4">
            <div className="flex gap-5 items-start w-full">
               <div className="size-8 rounded-full overflow-clip">
                  <Image
                     src={post.user?.avatar ?? "/images/users/avatar.png"}
                     width={100}
                     height={100}
                     alt="user avatar"
                     loading="lazy"
                  />
               </div>

               <p className="font-semibold text-sm pt-1">
                  {post.user?.username}
               </p>

               <p className="">
                  <time className="ml-auto text-mauve-400/60 text-[.65rem]">
                     {new Date(post.createdAt ?? 0).toLocaleDateString("en-US")}
                  </time>
               </p>

               <DropdownMenu>
                  <DropdownMenuTrigger
                     render={
                        <Button
                           variant="ghost"
                           className="h-full aspect-square bg-background text-foreground border!  border-[#ffffff00] hover:border-gray-600 rounded-full p-1 ml-auto cursor-pointer transition"
                        >
                           <MoreHorizontal className="size-5" />
                        </Button>
                     }
                  />

                  {hasDelete ? (
                     <DropdownMenuContent className="" align="start">
                        <DropdownMenuGroup>
                           <DropdownMenuItem
                              className="cursor-pointer text-red-400 flex items-center justify-between"
                              onClick={handleDeletePost}
                           >
                              Delete
                              <Trash />
                           </DropdownMenuItem>
                        </DropdownMenuGroup>
                     </DropdownMenuContent>
                  ) : null}
               </DropdownMenu>
            </div>
         </header>

         <main>
            {post?.image ? (
               <>
                  <div className="mb-5">
                     <div
                        className="rounded-lg overflow-clip h-50 aspect-3/4 border border-white/20 cursor-pointer bg-background"
                        aria-haspopup
                        onClick={() => setIsShowImageModal(true)}
                     >
                        <Image
                           src={post.image}
                           width={400}
                           height={400}
                           alt={post.title}
                           className="block size-full object-cover"
                           loading="lazy"
                        />
                     </div>
                  </div>
                  <MediaModal
                     mediaType="image"
                     src={post.image}
                     isOpen={isShowImageModal}
                     onClose={handleCloseImageModal} 
                  />
               </>
            ) : null}

            <Link href={`/posts/${post._id}`} className="block pt-3">
               <h3>{post.title}</h3>
            </Link>

            {post.tags && post.tags.length > 0 ? (
               <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
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

         <footer className="w-full flex justify-end">
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
               href={`/posts/${post._id}`}
               prefetch={false}
               className="rounded-full! cursor-pointer! text-blue-300 px-3 py-1 hover:bg-blue-400/10 transition"
            >
               Reply
            </Link>
         </footer>
      </article>
   );
};

export default PostCard;
