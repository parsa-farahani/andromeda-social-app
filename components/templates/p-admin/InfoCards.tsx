import React from 'react'
import InfoCard from './InfoCard'
import { AlertCircle, MessageSquare, StickyNote, User } from 'lucide-react'
import UserModel from '@/models/User'
import PostModel from '@/models/Post'
import CommentModel from '@/models/Comment'
import mongoose from 'mongoose'
import connectToDB from '@/configs/db'

const InfoCards = async () => {

   await connectToDB();

   // eslint-disable-next-line react-hooks/purity
   const since = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
   const sinceId = mongoose.Types.ObjectId.createFromTime(Math.floor(since.getTime() / 1000));


   const [users, newUsers, posts, newPosts, comments, newComments] = await Promise.all(
      [
         UserModel.estimatedDocumentCount(),
         UserModel.countDocuments({ _id: { $gte: sinceId } }),
         PostModel.estimatedDocumentCount(),
         PostModel.countDocuments({ _id: { $gte: sinceId } }),
         CommentModel.estimatedDocumentCount(),
         CommentModel.countDocuments({ _id: { $gte: sinceId } }),
      ]
   )

   await new Promise((res) => setTimeout(res, 1000))

  return (
    
        <section
          className='grid md:grid-cols-2 xl:grid-cols-4 gap-3'
        >

            <InfoCard
               href="/p-admin/users"
               title="Total Users"
               value={users}
               icon={
                  <div
                  className="bg-sky-300/20 size-12 aspect-square rounded-md  flex-center"
               >
                  <User className='text-sky-200' />
               </div>
               }
               newThisWeek={newUsers}
            />


            <InfoCard
            href="/p-admin/posts"
               title="Total Posts"
               value={posts}
               icon={
                  <div
                  className="bg-yellow-300/20 size-12 aspect-square rounded-md  flex-center"
               >
                  <StickyNote className='text-yellow-100' />
               </div>
               }
               newThisWeek={newPosts}
            />


            <InfoCard
            href="/p-admin/comments"
               title="Total Comments"
               value={comments}
               icon={
                  <div
                  className="bg-indigo-400/20 size-12 aspect-square rounded-md  flex-center"
               >
                  <MessageSquare className='text-indigo-300' />
               </div>
               }
               newThisWeek={newComments}
            />



            <InfoCard
               href="/p-admin/reports"
               title="Open Reports"
               value={120}
               icon={
                  <div
                  className="bg-pink-300/20 size-12 aspect-square rounded-md  flex-center"
               >
                  <AlertCircle className='text-pink-200' />
               </div>
               }
               newThisWeek={25}
            />
   
        </section>
  )
}

export default InfoCards