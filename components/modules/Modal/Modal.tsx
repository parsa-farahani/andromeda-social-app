'use client';

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom';


type ModalProps = {
   isOpen: boolean;
   className?: string;
   children: React.ReactNode;
   onClose: () => void;
   modalRootId?: string;
}


const Modal = (
   {
      isOpen,
      onClose,
      children,
      className,
      modalRootId = 'modal-root',
   }: ModalProps
) => {

   const overlayRef = useRef<HTMLDivElement | null>(null);
   const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

   useEffect(() => {

      function setRoot() {

         const rootId = modalRootId;

         let root = document.getElementById(rootId);
   
         if (!root) {
            root = document.createElement('div');
            root.id = rootId;
            document.body.appendChild(root);
         }
   
         setModalRoot(root);
      }

      setRoot();
   }, [])


   const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!isOpen) return;


      if (e.target === overlayRef.current) {
         onClose();
         enableBodyScroll(document.documentElement);
      }
   }

   useEffect(() => {
      if (isOpen) {
         disableBodyScroll(document.documentElement);
      } else {
         enableBodyScroll(document.documentElement);
      }
   }, [isOpen])


   if (!modalRoot) return null;


  return createPortal(

    <div
      ref={overlayRef}
      className={`fixed inset-0 z-10 bg-black/70 flex-center transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleClose}
    >
      <div
         className={`rounded-lg h-auto  max-lg:hidden-scroll ${className ?? ''}`}
      >
         {
            children
         }
      </div>
    </div>
  , modalRoot as HTMLDivElement)
}

export default Modal