'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Search, User } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import type { User as UserType } from '@/types/mongooseTypes'

const UserMenu = (
   {
      user,
   }:
   {
      user?: UserType;
   }
) => {

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

            // router.refresh();

            window.location.reload();

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
    <DropdownMenu>
      <DropdownMenuTrigger render={
         <Button variant="ghost" className="h-full aspect-square rounded-full cursor-pointer bg-background text-foreground border! border-gray-500/30">
            <User className='size-4' />
         </Button>
      }
      />

      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {
               (user && user?._id)
               ? (
                  <div>
                     <p>
                        {user.username}
                     </p>
                     {/* <p>
                        {user.email}
                     </p> */}
                  </div>
               ): (
                  "My Account"
               )
            }
         </DropdownMenuLabel>
          <DropdownMenuItem
            
            render={
               <Link href="/p-user" className='cursor-pointer'>
                  Profile
               </Link>
            }
          />       
          <DropdownMenuItem
            nativeButton
            render={
               <button className='flex items-center justify-between w-full cursor-pointer'
                  onClick={handleLogout}
               >
                  Log out
                  <LogOut className='size-3' />
               </button>
            }
         />     
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            <DropdownMenuItem
               
               render={
                  <Link href="/search" className='flex items-center justify-between w-full cursor-pointer'>
                     Search
                     <Search className='size-3' />
                  </Link>
               }
            />  
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>


  )
}

export default UserMenu