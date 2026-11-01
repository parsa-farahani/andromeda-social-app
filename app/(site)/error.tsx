"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const ErrorPage = ({
   error,
   reset,
}: {
   error: Error & { digest?: string };
   reset: () => void;
}) => {
   useEffect(() => {
      console.error("🔴 Error - error.tsx -> ", error);
   }, [error]);

   return (
      <div className="grow flex flex-col items-center justify-center gap-5 p-6 text-center">
         <div className="size-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="size-7 text-red-400" />
         </div>

         <div>
            <h2 className="text-2xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-gray-500 max-w-sm">
               An unexpected error occurred. You can try again, or go back to
               the feed.
            </p>
            {error.digest && (
               <p className="mt-2 text-xs text-gray-600">
                  Error ID: {error.digest}
               </p>
            )}
         </div>

         <div className="flex gap-3">
            <Button
               onClick={reset}
               variant="outline"
               className="cursor-pointer"
            >
               Try again
               <RefreshCcw className="size-4" />
            </Button>
            <Link
               href="/"
               className="inline-flex items-center rounded-md bg-white/10 hover:bg-white/20 px-4 text-sm transition"
            >
               Go to feed
            </Link>
         </div>
      </div>
   );
};

export default ErrorPage;
