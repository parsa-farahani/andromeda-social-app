"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import EditProfile from "./EditProfile";
import { User } from "@/types/mongooseTypes";
import Modal from "@/components/modules/Modal/Modal";
import LogoutButton from "./LogoutButton";
import { Menu, X } from "lucide-react";
import MediaModal from "@/components/modules/MediaModal/MediaModal";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const InfoHeader = ({ user, withEdit }: { user: User; withEdit?: boolean }) => {
   const [isOpenAvatarModal, setIsOpenAvatarModal] = useState(false);

   const handleCloseAvatarModal = useCallback(() => {
      setIsOpenAvatarModal(false);
   }, []);

   return (
      <>
         <section className="flex gap-8 max-md:gap-3 items-center h-20 max-md:h-10">
            <button
               className="rounded-full size-20 max-md:size-15 overflow-clip cursor-pointer border border-white/10"
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
            <p className="h-full pt-5 max-md:pt-2 text-xl max-md:text-base font-semibold">
               {user?.username}
            </p>

            <div className="ml-auto flex items-center gap-3">

               {withEdit && (
                  <EditProfile user={user} />
               )}

               <LogoutButton />

               <SidebarTrigger className="md:hidden cursor-pointer"
                  render={
                     <Button variant="ghost" className="size-8! rounded-full! aspect-square!" >
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
