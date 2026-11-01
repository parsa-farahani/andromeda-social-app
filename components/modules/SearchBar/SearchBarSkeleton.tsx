import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import React from "react";

const SearchBarSkeleton = () => {
   return (
      <div className="flex items-center justify-center p-3 max-lg:px-5">
         <div className="h-12 grow shrink-0 md:max-w-1/2 rounded-full relative">
            <Skeleton className="absolute rounded-full inset-0 " />
            <div className="absolute h-full aspect-square  right-0 p-1">
               <Skeleton className="flex-center size-full rounded-full text-gray-500">
                  <Search className="size-4" />
               </Skeleton>
            </div>
         </div>
      </div>
   );
};

export default SearchBarSkeleton;
