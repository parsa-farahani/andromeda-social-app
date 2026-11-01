import React from 'react'
import DailyChart from './charts/DailyChart'
import { getDailyCounts } from '@/utils/stats/dbStats';
import connectToDB from '@/configs/db';
import PostModel from '@/models/Post';
import CommentModel from '@/models/Comment';

const PostsChart = async () => {


   await connectToDB();

   const [posts, comments] = await Promise.all(
      [
         getDailyCounts(PostModel, 30),
         getDailyCounts(CommentModel, 30),
      ]
   )
   
   const formattedPostsData = posts.map(({ date, count }, i) => (
      {
         date: date.slice(date.indexOf('-') + 1),
         count,
         count2: comments[i].count,
      }
   ))

   const totalPosts = posts.reduce((sum, d) => sum + d.count, 0);

   const totalComments = comments.reduce((sum, d) => sum + d.count, 0);

   await new Promise(res => setTimeout(res, 2000))


  return (
    <div
      className=" rounded-lg p-5 "
    >
      <div className='mb-4' >
         <h2 className='mb-2 text-2xl font-semibold' >
         Posts & Comments
         </h2>
         <p className='text-sm text-gray-500 mb-10' >
            <span className="text-white mr-2 border border-(--color-posts-count) text-black inline-flex px-2 gap-1 items-center justify-center h-7 rounded-full" >
               <span>
                  {totalPosts}
               </span>
               <span>
                  Posts
               </span>
            </span>
            <span className="text-white mr-2 border border-(--color-comments-count) text-black inline-flex px-2 gap-1 items-center justify-center h-7 rounded-full" >
               <span>
                  {totalComments}
               </span>
               <span>
                  Comments
               </span>
            </span>
            in the last 30 days
         </p>
      </div>
      <DailyChart
         data={
           formattedPostsData
         }
         label="Posts"
         label2="Comments"
         lineColor="var(--color-posts-count)"
         lineColor2="var(--color-comments-count)"
         allowDecimalsY={false}
      />
   </div>
  )
}

export default PostsChart