'use client'

import Modal from '@/components/modules/Modal/Modal';
import React from 'react'
import { useRouter } from 'next/navigation';
import SignupForm from './SignupForm';

const SignUpModal = (
   {
      returnUrl,
   }: {
      returnUrl?: string;
   }
) => {

  const router = useRouter();


  return (
    <Modal
      isOpen={true}
      onClose={() => { router.back() }}
      className='w-[100vw] md:min-w-[400px] md:max-w-fit max-md:px-5'
    > 
      <SignupForm isModal returnUrl={returnUrl} />
    </Modal>
  )
}

export default SignUpModal