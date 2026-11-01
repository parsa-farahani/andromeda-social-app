import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const HeaderSkeleton = () => {
  return (
    <div className="container py-3 flex items-center gap-3 ">
         <Skeleton className='rounded-lg size-12' />
         <div className="ml-auto flex gap-2 items-center" >
            <Skeleton className='rounded-lg h-10 w-16' />
            <Skeleton className='rounded-full size-10' />

         </div>
      </div>
  )
}

export default HeaderSkeleton