import CommentCard from '@/components/modules/CommentCard/CommentCard';
import CommentModel from '@/models/Comment'
import { Comment } from '@/types/mongooseTypes'
import React from 'react'
import CommentViewCard from './CommentViewCard';

const CommentsList = (
   {
      comments = [],
   }: {
      comments: (Comment & { isLiked: boolean })[];
   }
) => {



  return (
    <div className='grow flex flex-col min-h-0' >
      {
         (comments && comments?.length > 0)
         ? (
            <div
               className='border rounded-xl flex-1 min-h-0 overflow-y-auto pr-3 pb-20 scrollbar-hidden flex flex-col'
            >

               <ul>
                  {
                     comments.map((comment) => (
                        <li
                           key={comment._id}
                           
                        >
                           <CommentViewCard
                              comment={comment}
                           />
                        </li>
                     ))
                  }
               </ul>
            </div>
         )
         : (
            <div className='grow flex-center flex-col '>
               <p className='flex-center flex-col gap-5 items-center ' >
                  <span className='text-xl' >
                   🎃 No Comment Yet...
                  </span>
               </p>
            </div>
         )
      }
    </div>
  )
}

export default CommentsList