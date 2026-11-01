import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const InfoCardsSkeleton = () => {
  return (
      <div
         className='grid md:grid-cols-2 xl:grid-cols-4 gap-3'
      >
         <Skeleton
            className='h-26 rounded-lg'
         />
         <Skeleton
            className='h-26 rounded-lg'
         />
         <Skeleton
            className='h-26 rounded-lg'
         />
         <Skeleton
            className='h-26 rounded-lg'
         />
      </div>
  )
}

export default InfoCardsSkeleton