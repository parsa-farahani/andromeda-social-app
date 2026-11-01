import HeaderSkeleton from "@/components/modules/Header/HeaderSkeleton";
import PostsResults from "@/components/templates/home/PostsResults";
import PostsSkeleton from "@/components/templates/home/PostsSkeleton";
import HeaderWithUser from "@/components/templates/search/HeaderWithUser";
import { authUser } from "@/utils/serverHelpers";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";


const Home = async () => {

   return (
      <>
         <div className="w-full" >
            <Suspense
               fallback={<HeaderSkeleton />}
            >
               <HeaderWithUser />
            </Suspense>
         </div>
         <main className="container min-h-0 flex flex-col grow relative">
            <section className="pt-5 min-h-0 flex flex-col grow">

               <div className="flex items-center gap-3" >
                  <h2 className="font-semibold text-xl">Recent Posts</h2>
               </div>

               <div className="mt-6 border rounded-xl flex-1 min-h-0 overflow-y-auto pb-20 flex flex-col scrollbar-hidden ">
                  <Suspense
                     fallback={<PostsSkeleton />}
                  >
                     <PostsResults />
                  </Suspense>
               </div>
            </section>

            <div className="absolute right-5 bottom-5 lg:-right-24 lg:bottom-10 z-10">
               <Link
                  href="/p-user/create"
                  className="block h-auto py-3 px-5 cursor-pointer flex-center bg-blue-400 hover:bg-blue-500 text-black rounded-lg"
               >
                  <MessageSquarePlus className="block size-7 -rotate-y-180" />
               </Link>
            </div>
         </main>
      </>
   );
};

export default Home;
