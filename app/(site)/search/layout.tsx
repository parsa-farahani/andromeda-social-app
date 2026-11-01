import HeaderSkeleton from '@/components/modules/Header/HeaderSkeleton';
import SearchBarSkeleton from '@/components/modules/SearchBar/SearchBarSkeleton';
import HeaderWithUser from '@/components/templates/search/HeaderWithUser';
import SearchBarWrapper from '@/components/templates/search/SearchBarWrapper';
import React, { ReactNode, Suspense } from 'react'

const Layout = async (
   {
      children
   }: {
      children: ReactNode
   }
) => {



  return (
    <div className="w-full h-svh flex flex-col min-h-0 relative" >

      <Suspense
         fallback={<HeaderSkeleton />}
      >
         <HeaderWithUser />
      </Suspense>

      <div className="container min-h-0 flex flex-col grow relative">

         <Suspense
            fallback={<SearchBarSkeleton />}
         >
            <SearchBarWrapper />
         </Suspense>

         

        {
         children
        }
        
      </div>

    </div>
  )
}

export default Layout