import { authUser } from '@/utils/serverHelpers';
import { redirect } from 'next/navigation';
import React from 'react'

const Layout = async (
   { children }
   : LayoutProps<"/signin">
) => {

   const user  = await authUser();
 
   if (user) {
      redirect('/p-user')
   }

  return (
    <>
      {
         children
      }
    </>
  )
}

export default Layout