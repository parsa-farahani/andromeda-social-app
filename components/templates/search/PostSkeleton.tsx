import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const PostSkeleton = () => {
   return (
      <div className="py-5 border-b w-full">
         <div className="flex w-fit items-center gap-4 mb-5">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="grid gap-2">
               <Skeleton className="h-4 w-25" />
            </div>
         </div>
         <div className="w-full flex items-center gap-4 mb-3">
            <Skeleton className="h-6 w-1/3" />
         </div>
         <div className="w-full flex items-center justify-end gap-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-10 rounded-full" />
         </div>
      </div>
   );
};

export default PostSkeleton;
