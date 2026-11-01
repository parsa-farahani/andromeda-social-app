import HeaderSkeleton from "@/components/modules/Header/HeaderSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = async () => {
   return (
      <div className="container">
         <HeaderSkeleton />
         <div>
            <div className="h-20 flex gap-5 items-center">
               <Skeleton className="size-12 rounded-full" />

               <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-15 rounded-full" />

                  <Skeleton className="h-5 w-10 rounded-full" />
               </div>
            </div>
         </div>

         <div className="py-3 border-b">
            <div className="mb-5">
               <Skeleton className="rounded-lg h-60 aspect-3/4" />
            </div>
            <Skeleton className="h-5 w-1/3 rounded-full" />

            <div className="w-full flex justify-end gap-3">
               <Skeleton className="size-8 rounded-full" />
               <Skeleton className="h-8 w-10 rounded-full" />
            </div>
         </div>

         <div className="mt-5">
            <Skeleton className="h-15 w-full rounded-full" />
         </div>
      </div>
   );
};

export default loading;
