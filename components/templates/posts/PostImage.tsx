"use client";

import MediaModal from "@/components/modules/MediaModal/MediaModal";
import Modal from "@/components/modules/Modal/Modal";
import Image from "next/image";
import React, { useCallback, useState } from "react";

const PostImage = ({ image, title }: { image: string; title?: string }) => {
   const [isShowImageModal, setIsShowImageModal] = useState(false);

   const handleCloseImageModal = useCallback(() => {
      setIsShowImageModal(false);
   }, []);

   return (
      <>
         <div className="mb-5">
            <div
               className="rounded-lg overflow-clip h-60 aspect-3/4 border border-white/20 cursor-pointer bg-background"
               aria-haspopup
               onClick={() => setIsShowImageModal(true)}
            >
               <Image
                  src={image}
                  width={400}
                  height={400}
                  alt={title ?? ""}
                  className="block size-full object-cover"
                  loading="eager"
                  priority
               />
            </div>
         </div>
         <MediaModal
            mediaType="image"
            src={image}
            isOpen={isShowImageModal}
            onClose={handleCloseImageModal} 
         />
      </>
   );
};

export default PostImage;
