import { HamburgerIcon, LogIn, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserMenu from "./UserMenu";
import { User } from "@/types/mongooseTypes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const Header = (
   {
      isLoggedIn,
      user,
      // hasSearch,
   }: {
      isLoggedIn: boolean;
      user?: User;
      // hasSearch?: boolean;
   }
) => {


   return (
      <header>
         <nav  >
            <div className="container py-3 flex items-center gap-3 ">

               <div className="flex items-center gap-5" >
                  <Link
                     href="/"
                  >
                     <Image
                        src="/images/logo/logo-sm.png"
                        alt="Home Logo"
                        width={200}
                        height={200}
                        className="size-12"
                        priority
                     />
                  </Link>

                  {/* {
                     (hasSearch)
                     ? (
                        <SearchBar />
                     ): null
                  } */}
                  
               </div>

               <div className="ml-auto flex gap-2 items-center" >

                  <SidebarTrigger className="md:hidden cursor-pointer"
                     render={
                        <Button variant="ghost" className="size-8 rounded-full aspect-square" >
                           <Menu />
                        </Button>
                     }
                  />

                  {
                     !isLoggedIn
                     && (
                        <Link
                           href="/signin"
                           className="border rounded-md py-2 px-3 ml-auto inline-flex gap-2 items-center text-sm"
                        >
                           Login
                           <LogIn className="size-4" />
                        </Link>
                     )
                  }
                  
                  {
                     isLoggedIn
                     && (
                        <UserMenu user={user} />
                     )
                  }
               </div>
            </div>
         </nav>
      </header>
   );
};

export default Header;
