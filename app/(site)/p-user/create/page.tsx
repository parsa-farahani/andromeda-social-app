
import CreatePostForm from '@/components/templates/p-user/create/CreatePostForm'
import InfoHeader from '@/components/templates/p-user/InfoHeader'
import connectToDB from '@/configs/db'
import { authUser } from '@/utils/serverHelpers'
import React from 'react'


const CreatePost = async () => {

   await connectToDB();
   const user = await authUser();

  return (
   <>
      <InfoHeader user={user} />

      <hr className='mt-6 mb-3' />

      <CreatePostForm user={user} />
   </>
  )
}

export default CreatePost