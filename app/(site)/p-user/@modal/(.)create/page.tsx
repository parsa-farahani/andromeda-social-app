
import CreatePostModal from '@/components/templates/p-user/create/CreatePostModal'
import connectToDB from '@/configs/db'
import { authUser } from '@/utils/serverHelpers'
import { redirect } from 'next/navigation'
import React from 'react'


const CreatePostModalPage = async () => {

  await connectToDB();
  const user = await authUser();

   if (!user) {
      redirect("/signin");
   }

  return (
      <CreatePostModal user={user} /> 
  )
}

export default CreatePostModalPage