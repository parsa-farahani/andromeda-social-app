'use client'

import Modal from '@/components/modules/Modal/Modal';
import React from 'react'
import SigninForm from './SigninForm';
import { useRouter } from 'next/navigation';

const SignInModal = (
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
      <SigninForm isModal returnUrl={returnUrl} />
    </Modal>
  )
}

export default SignInModal