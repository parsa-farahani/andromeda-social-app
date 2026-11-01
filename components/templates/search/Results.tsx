import React from 'react'
import PostsList from './PostsList'
import { getSearchPosts } from '@/utils/pagedFetch/search';
import { normalizeSearchParams } from '@/utils/search';
import { authUser } from '@/utils/serverHelpers';

const Results = async (
   {
      params,
   }: {
      params: {
         q?: string | string[];
         tag?: string | string[];
      }
   }
) => {

   const { q, tag } = params;
   const { words, tags } = normalizeSearchParams({ q, tag });

   const user = await authUser();
   
   const { posts, nextCursor } = await getSearchPosts({ q, tag }, null, user?._id);

   const key = JSON.stringify({ words, tags });

   const hasQuery = words.length > 0 || tags.length > 0;


  return (
     <section className="pt-5 min-h-0 flex flex-col grow">
        
         {posts && posts?.length > 0 ? (
            <PostsList
               key={`postslist-${key ?? "empty"}`}
               initialPosts={posts}
               initialCursor={nextCursor}
               searchParams={{ q, tag }}
            />
         ) : (
            <div className="min-h-0 flex flex-col grow items-center pt-5">
               {hasQuery ? (
                  <p className="text-gray-500">No posts found...</p>
               ) : (
                  <p className="text-gray-500">
                     Please Enter Something To Search...
                  </p>
               )}
            </div>
         )}
      </section>
  )
}

export default Results