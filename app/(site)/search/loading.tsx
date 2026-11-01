import PostSkeleton from '@/components/templates/search/PostSkeleton'
import React from 'react'

const Loading = () => {
  return (
    <div className="pt-5 min-h-0 flex flex-col grow" >
      {
            Array(3)
            .fill(null)
            .map((_, i) => (
               <PostSkeleton
                  key={i}
               />
            ))
      }
    </div>
  )
}

export default Loading