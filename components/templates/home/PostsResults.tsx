import React from 'react'
import PostsList from './PostsList'
import connectToDB from '@/configs/db';
import { getPosts } from '@/utils/pagedFetch/posts';
import Link from 'next/link';
import { authUser } from '@/utils/serverHelpers';
import { Post } from '@/types/mongooseTypes';

const PostsResults = async (

) => {

   await connectToDB();

   const user = await authUser();

   const [{ posts, nextCursor }]
   : [{ posts: (Post & { isLiked: boolean; })[], nextCursor: string | null }] =
   await Promise.all([
      getPosts(null, user?._id),
   ]);

   await new Promise((res) => setTimeout(res, 1000));

   

  return (
    <>
      {posts && posts?.length > 0 ? (
         <PostsList initialPosts={posts} initialCursor={nextCursor} />
      ) : (
         <div className="grow flex-center flex-col ">
            <div className="flex flex-col gap-5 items-center ">
               <p className="text-xl">🤔 No Post Yet...</p>
               <Link
                  href="/p-user/create"
                  className="cursor-pointer border py-1 px-2 rounded-md bg-white/5"
               >
                  Create Your first post!
               </Link>
            </div>
         </div>
      )}
    </>
  )
}

export default PostsResults