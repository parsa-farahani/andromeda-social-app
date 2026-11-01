import PostSkeleton from '@/components/templates/search/PostSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <div className='grow flex flex-col min-h-0' >

      <div className="flex justify-between items-center" >
        <Skeleton className="size-20 rounded-full" />

        <Skeleton className="size-10 rounded-full" />
      </div>

      <hr className='mt-8 mb-3' />

      <section className="grow flex flex-col min-h-0" >

        <div className="flex gap-3 w-full" >
            <Skeleton className="h-15 grow rounded-md" />
            <Skeleton className="h-15 grow rounded-md" />
        </div>

        <div
            className="mt-5 grow flex flex-col min-h-0"
         >
          <div className='grow flex flex-col min-h-0' >


            <Skeleton className="h-15 w-full rounded-lg" />

            <hr className='my-5' />

            <div
            className='border rounded-xl flex-1 min-h-0 overflow-y-auto px-3 pb-20 scrollbar-hidden flex flex-col'
            >
              {
                Array(3).fill(null)
                .map((_, i) => (
                  <PostSkeleton key={i} />
                ))
              }
            </div>
         </div>
        </div>
      </section>
    </div>
  )
}

export default loading