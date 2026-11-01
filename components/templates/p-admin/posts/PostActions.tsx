"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Heart } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@/types/mongooseTypes";

const PostActions = ({ post }: { post: Post & { isLiked: boolean } }) => {
   const router = useRouter();

   const [liked, setLiked] = useState(post.isLiked ?? false);
   const [count, setCount] = useState((post.likesCount as number) ?? 0);

   const handleLike = async () => {
      const next = !liked;

      setLiked(next);
      setCount((c) => Math.max(0, c + (next ? 1 : -1)));

      try {
         const res = await fetch(`/api/likes`, {
            method: next ? "POST" : "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId: post._id }),
         });

         if (res.status === 201) {
            toast.add({
               type: "success",
               title: "Post Like is updated Successfully.",
            });

            router.refresh();
         } else if (res.status === 422) {
            throw new Error("Failed to update Like - Invalid Data");
         } else if (res.status === 401) {
            throw new Error("Failed to update Like - Unauthorized");
         } else if (res.status === 409) {
            throw new Error("Already liked");
         } else {
            throw new Error("Failed to update Like");
         }
      } catch (error) {
         setLiked(!next);
         setCount((c) => Math.max(0, c + (next ? -1 : 1)));

         console.log("🔴 Error - handle-like -> ", error);

         toast.add({
            type: "error",
            title:
               error instanceof Error
                  ? error?.message
                  : "Failed to update Like - Unknown Error",
         });
      }
   };


   return (
      <div className="w-full flex justify-end">
         <Button
            variant="ghost"
            className={`rounded-full! cursor-pointer! ${liked ? "text-[hotpink] hover:text-[hotpink]" : ""}`}
            onClick={handleLike}
         >
            <span className="block text-lg!">{count}</span>
            <Heart className="size-6" fill={liked ? "hotpink" : ""}  />
         </Button>
      </div>
   );
};

export default PostActions;
