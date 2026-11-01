'use client'

import { toast } from '@/components/ui/toast'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'


const LogoutButton = () => {

   const router = useRouter();

   const handleLogout = async () => {

      try {

         const res = await fetch('/api/auth/signout', {
            method: 'POST',
         });

         if (res.status === 200) {

            toast.add(
               {
                  type: 'success',
                  title: 'Logged Out Successfully.'
               }
            )

            router.replace('/');
            router.refresh();
         }
         else if (res.status === 401) {
            toast.add(
                  {
                  type: 'error',
                  title: 'UnAuthorized.',
                  }
            )
         }
         else if (res.status === 404) {
            toast.add(
                  {
                  type: 'error',
                  title: 'User Not Found.',
                  }
            )
         }
         else {
            toast.add(
               {
                  type: 'error',
                  title: 'Log Out Failed - Try Again'
               }
            )
         }
         
      } catch (error) {

         console.log(`🔴 Erorr - ${error}`)

         toast.add(
            {
               type: 'error',
               title: 'Log Out Failed - Try Again'
            }
         )
      }
   }

  return (
    <Tooltip>
      <TooltipTrigger
         onClick={() => handleLogout()}
         className="inline-block border rounded-full p-2 aspect-square cursor-pointer text-xs"
      >
         <span className="">
            {/* <MoreHorizontal /> */}
            <LogOut className="size-4" />
         </span>
      </TooltipTrigger>
      <TooltipContent>
         <p>Logout</p>
      </TooltipContent>
   </Tooltip>
  )
}

export default LogoutButton