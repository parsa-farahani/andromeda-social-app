'use client'

import PostCard from '@/components/modules/PostCard/PostCard'
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { Post, User } from '@/types/mongooseTypes'
import { RefreshCcw } from 'lucide-react';
import React, { useEffect, useEffectEvent, useState } from 'react'
import { useInView } from 'react-intersection-observer';



interface PostsListProps {
   initialPosts: (Post & { isLiked: boolean; })[];
   initialCursor: string | null;
}


const PostsList = (
   {
      initialPosts,
      initialCursor,
   }: PostsListProps
) => {


   const [posts, setPosts] = useState(initialPosts);

   const [cursor, setCursor] = useState(initialCursor);

   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);

   const { inView, ref: infiniteScrollRef } = useInView();

   const [isRefreshing, setIsRefreshing] = useState(false);


   const handleRefresh = async () => {

      setIsRefreshing(true);

      try {

         const res = await fetch('/api/posts/paginated');

         if (res.status === 200) {

            const postsDocs = await res.json();
            
            const {posts: postsData, nextCursor} = JSON.parse(JSON.stringify(postsDocs));

            setPosts(postsData);

            setCursor(nextCursor);

            toast.add(
               {
                  type: 'success',
                  title: 'Refreshed Posts Successfully.'
               }
            )
         }
         else {
            throw new Error('error')
         }
         
      } catch (error) {
         console.log('🔴 Error - handleRefresh -> ', error);
         toast.add(
               {
                  type: 'error',
                  title: 'Failed to Refresh Posts.'
               }
            )
      }
      finally {
         setIsRefreshing(false);
      }
   }

   const handleLoadMore = async () => {

      if (!cursor || isLoading) return;
      
      setIsLoading(true);
      setIsError(false);

      try {
         const res = await fetch(`/api/posts/paginated?cursor=${cursor}`);

         if (res.status === 200) {

            const data: { posts: (Post & { isLiked: boolean; })[]; nextCursor: string | null } = await res.json();

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
   <>
      <Button
      onClick={() => handleRefresh()}
      variant="ghost"
      className="cursor-pointer rounded-b-none rounded-t-xl"
      disabled={isRefreshing}
    >
      {
         (isRefreshing)
         ? "Refreshing..."
         : "Refresh"
      }
      <RefreshCcw className={`${isRefreshing ? 'animate-spin' : ""}`} />
    </Button>
   
   <div>
      <ul>
         {posts.map((post) => (
            <li key={`${post._id}-${post.likesCount}-${post.isLiked}`} className="p-5 border-b flex">
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
   </>
  )
}

export default PostsList