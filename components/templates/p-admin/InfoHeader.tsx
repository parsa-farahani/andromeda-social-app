"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import { User } from "@/types/mongooseTypes";
import Modal from "@/components/modules/Modal/Modal";
import LogoutButton from "./LogoutButton";
import { Menu, X } from "lucide-react";
import EditProfile from "./EditProfile";
import MediaModal from "@/components/modules/MediaModal/MediaModal";
import { SidebarTrigger } from "@/components/ui/pAdminSidebar";
import { Button } from "@/components/ui/button";



const InfoHeader = ({ user, withEdit }: { user: User; withEdit?: boolean }) => {
   const [isOpenAvatarModal, setIsOpenAvatarModal] = useState(false);

   const handleCloseAvatarModal = useCallback(() => {
      setIsOpenAvatarModal(false);
   }, []);

   return (
      <>
         <section className="flex gap-5 items-center h-20 px-5">
            <button
               className="rounded-full size-12 overflow-clip cursor-pointer border border-white/10"
               onClick={() => setIsOpenAvatarModal(true)}
            >
               <Image
                  src={user?.avatar || "/images/users/avatar.png"}
                  width="80"
                  height="80"
                  alt="user avatar"
                  className="object-cover size-full"
               />
            </button>

            <div  className="h-full pt-3 ">
               <p className="text-xl font-semibold">
                  {user?.username}
               </p>
               <p className="text-sm text-gray-500 flex items-center gap-1" >
                  <span className="inline-block size-1 rounded-full bg-indigo-400 " />
                  Admin
               </p>
            </div>

            <div className="ml-auto flex items-center gap-3">


               {withEdit && (
                  <EditProfile user={user} />
               )}

               <LogoutButton />

               <SidebarTrigger className="md:hidden cursor-pointer"
                  render={
                     <Button variant="ghost" className="size-8 rounded-full aspect-square" >
                        <Menu />
                     </Button>
                  }
               />
            </div>
         </section>

         {user.avatar && (
            <MediaModal
               mediaType="image"
               src={user.avatar}
               isOpen={isOpenAvatarModal}
               onClose={handleCloseAvatarModal} 
               // imageWrapperClassName=" aspect-square! md:size-100! overflow-clip"
               imageClassName="w-auto aspect-square! object-cover"
            />
         )}
      </>
   );
};

export default InfoHeader;
