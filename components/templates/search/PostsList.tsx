'use client'

import PostCard from '@/components/modules/PostCard/PostCard'
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { Post } from '@/types/mongooseTypes'
import { RefreshCcw } from 'lucide-react';
import React, { useEffect, useEffectEvent, useState } from 'react'
import { useInView } from 'react-intersection-observer';


interface PostsListProps {
   initialPosts: (Post & { isLiked: boolean })[];
   initialCursor: string | null;
   searchParams: {
      q?: string | string[];
      tag?: string | string[];
   };

}


const PostsList = (
   {
      initialPosts,
      initialCursor,
      searchParams,
   }: PostsListProps
) => {


   const [posts, setPosts] = useState(initialPosts);

   const [cursor, setCursor] = useState(initialCursor);

   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);

   const { inView, ref: infiniteScrollRef } = useInView();


   const handleLoadMore = async () => {

      if (!cursor || isLoading) return;
      
      setIsLoading(true);
      setIsError(false);


      const params = new URLSearchParams();

      params.set('cursor', cursor);

      const { q, tag } = searchParams;


      if (q) {

         if (typeof q === 'string') {
            params.set('q', q);
         } else {
            for (const term of q) {
               params.append('q', term);
            }
         }
      }

      if (tag) {

         if (typeof tag === 'string') {
            params.set('tag', tag);
         } else {
            for (const term of tag) {
               params.append('tag', term);
            }
         }
      }


      try {
         const res = await fetch(`/api/posts/paginated/search?${params.toString()}`);

         if (res.status === 200) {

            const data: { posts: (Post & {isLiked: boolean})[]; nextCursor: string | null } = await res.json();

            setPosts(prev => {
               const ids = new Set(prev.map((p) => p._id));

               return [
                  ...prev,
                  ...data.posts.filter((p) => !ids.has(p._id))
               ]
            })

            setCursor(data.nextCursor)
         }
         else {
            throw new Error('Failed to Fetch Posts - Try Again');
         }
      } catch (error) {
         setIsError(true);
         toast.add(
            {
               type: 'error',
               title: error instanceof Error ? error.message : 'Failed to Fetch Posts - Try Again',
            }
         )
      }
      finally {
         setIsLoading(false);
      }
   }


   const handleInView = useEffectEvent(() => {
      handleLoadMore();
   })

   useEffect(() => {

      const checkInView = () => {
         if (inView && cursor && !isLoading && !isError) {
            handleInView();
         }
      }

      checkInView();
   }, [inView, cursor, isLoading, isError])

  return (
   <div>
      <ul>
         {posts.map((post) => (
            <li key={post._id} className="p-5 border-b flex">
               <PostCard post={post} />
            </li>
         ))}
      </ul>

      {
         cursor && (
            isError 
            ? (
               <div className="p-3" >
                  <div className="flex gap-3 items-center py-2 p-3 border border-white/10 rounded-md bg-red-500/10 justify-between" >
                     <p>
                        Failed to Fetch Posts
                     </p>
                     <Button className="cursor-pointer bg-background!" onClick={handleLoadMore} variant="outline">
                        Retry
                        <RefreshCcw className="size-3" />
                     </Button>
                  </div>
               </div>
            ): (
               <div className="p-3" >
                  <div
                     className='flex-center py-2'
                     ref={infiniteScrollRef}
                  >
                     <Spinner className='size-6' />
                  </div>
               </div>
            )
         )
      }
   </div>
  )
}

export default PostsList