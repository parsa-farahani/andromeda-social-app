'use client';

import { ArrowRight } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { Post, User } from '@/types/mongooseTypes';
import Modal from '@/components/modules/Modal/Modal';
import PostCard from '@/components/modules/PostCard/PostCard';
import Link from 'next/link';


interface PostsListProps {
   user: User;
   posts: (Post & { isLiked: boolean})[];
}


const PostsList = (
   { user, posts=[] }: PostsListProps
) => {


   const [showCreateModal, setShowCreateModal] = useState(false);


   const handleCloseCreateModal = useCallback(
      () => {
         setShowCreateModal(false)
      }
      , []
   )


  return (
    <div className='grow flex flex-col min-h-0' >

      <Modal
         isOpen={showCreateModal}
         onClose={handleCloseCreateModal}
      >
         create modal
      </Modal>
      
      <Link
         href="/p-user/create"
         className='relative min-h-14 md:min-h-17 h-auto'
      >
         <div
            className="md:text-lg! h-full flex items-center min-h-14 md:min-h-17 px-2 py-2 md:py-4 md:px-4 bg-gray-400/20 rounded-md border cursor-text text-white/60"
         >
            Whats in your mind? ...
         </div>
         <div
            className="w-fit md:text-lg px-3 py-2 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer flex items-center gap-2 bg-slate-200 text-black rounded-md"
         >
            Post <ArrowRight className="max-md:size-4" />
         </div>
      </Link>

      <hr className='my-2 md:my-5' />

      <div
       className='border rounded-xl flex-1 min-h-0 overflow-y-auto pr-3 pb-20 scrollbar-hidden relative flex flex-col'
      >
         {
            (posts && posts?.length > 0)
            ? (
               <ul
                  
               >
                  {
                     posts.map((post) => (
                        <li
                           key={post._id}
                           className='p-5 border-b flex'
                        >
                           <PostCard post={post} hasDelete />
                        </li>
                     ))
                  }
               </ul>
            )
            : (
               <div className='grow flex-center flex-col '>
                  <p className='flex flex-col gap-5 items-center ' >
                     <span className='text-xl' >
                     🤔 No Post Yet...
                     </span>
                     <Link    
                        href="/p-user/create"
                        className="cursor-pointer border py-1 px-2 rounded-md bg-white/5"
                     >
                        Create Your first post!
                     </Link>
                  </p>
               </div>
            )
         }
      </div>
    </div>
  )
}

export default PostsList