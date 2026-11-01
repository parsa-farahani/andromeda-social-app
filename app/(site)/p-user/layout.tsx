import EditProfile from '@/components/templates/p-user/EditProfile'
import InfoHeader from '@/components/templates/p-user/InfoHeader'
import { authUser } from '@/utils/serverHelpers'
import Image from 'next/image'
import React from 'react'

const Layout = async (
   {
      children,
      modal,
   }: LayoutProps<"/">
) => {

   
  return (
   <>
      <div className='container h-svh' >
         
         <div className='h-full pt-5 flex flex-col min-h-0' >

            {
               children
            }
         
         </div>
         
      </div>
      
      {
         modal
      }
   </>
  )
}

export default Layout