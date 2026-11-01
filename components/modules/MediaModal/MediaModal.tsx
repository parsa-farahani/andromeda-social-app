'use client'
import React from 'react'
import Modal from '../Modal/Modal'
import Image from 'next/image';
import { X } from 'lucide-react';


const MediaModal = (
   {
      mediaType = 'image',
      src,
      isOpen,
      onClose,
      restProps,
      imageWrapperClassName,
      imageClassName,
      alt,
   }: {
      mediaType: 'image' | 'video';
      src: string;
      isOpen: boolean;
      onClose: ()=> void;
      restProps?: object;
      imageWrapperClassName?: string;
      imageClassName?: string;
      alt?: string;
   }
) => {

   

  return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         {...restProps}
      >
         <div className={`relative w-fit  mx-auto ${imageWrapperClassName ?? ""}`}>
            <button
               onClick={onClose}
               aria-label="Close"
               className="absolute z-10 -top-10 right-0 text-lg"
            >
               <X className="text-white size-6 cursor-pointer" />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
               src={src}
               alt={alt ?? ""}
               className={`block max-w-[92vw] max-h-[80vh] w-auto h-auto object-contain rounded-lg border border-white/30 bg-background ${imageClassName ?? ""}`}
            />
         </div>
         {/* <div className="w-full relative max-md:px-3">
            <button
               className="absolute z-10 -top-10 right-5 md:-right-10 text-lg block"
               onClick={onClose}
            >
               <X className="text-white size-6 cursor-pointer" />
            </button>
            <div
               className={`relative overflow-clip rounded-lg h-fit max-h-[70vh] md:w-full md:max-w-70vw  border border-white/30 bg-background ${imageWrapperClassName ?? ""}`}
            >
               <Image
                  src={src}
                  width={800}
                  height={800}
                  alt=""
                  className="block size-full object-cover"
               />
            </div>
         </div> */}
      </Modal>
  )
}

export default MediaModal