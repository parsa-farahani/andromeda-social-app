import React from 'react'
import PostSkeleton from '../search/PostSkeleton'

const PostsSkeleton = () => {
  return (
    <div className="px-3 min-h-0 flex flex-col grow" >
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

export default PostsSkeleton