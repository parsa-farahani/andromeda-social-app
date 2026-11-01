'use client'

import React from 'react'
import CreatePostForm from './CreatePostForm'
import Modal from '@/components/modules/Modal/Modal'
import { User } from '@/types/mongooseTypes'
import { useRouter } from 'next/navigation'

const CreatePostModal = (
   {
      user
   }: {
      user: User;
   }
) => {

   const router = useRouter();

   const handleComplete = () => {
      router.back();
   }

  return (
    <Modal 
      isOpen={true}
      onClose={() => router.back()}
      className='md:w-[600px]! md:max-w-[80vw]!'
    >
      <CreatePostForm user={user} onComplete={handleComplete} />
    </Modal>
  )
}

export default CreatePostModal