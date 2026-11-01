import connectToDB from '@/configs/db';
import PostModel from '@/models/Post';
import { Post } from '@/types/mongooseTypes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const RecentPosts = async () => {

  await connectToDB();


  const recentPostsDocs = await PostModel.find(
    {}
  )
  .populate("user", "avatar username")
  .sort({ _id: -1 })
  .limit(5)
  .lean()

  const recentPosts: Post[] = JSON.parse(JSON.stringify(recentPostsDocs));


  await new Promise((res) => setTimeout(res, 2000))


  return (
    <div
      className="w-full border rounded-lg p-5 max-md:p-3"
    >
      <h2 className='mb-4 text-2xl font-semibold' >
        Recent Posts
      </h2>
      {
        (recentPosts && recentPosts.length > 0)
        ? (
          <ul
            className="w-full max-w-full overflow-x-auto"
          >
            {
              recentPosts.map((post) => (
                <li
                  key={post._id}
                >
                  <Link
                    href={`/posts/${post._id}`}
                    className="h-14 border rounded-sm p-2 mb-2 flex gap-2 justify-between items-center bg-sky-300/10 hover:bg-sky-300/20 transition"
                  >
                    <div
                      className="w-full min-w-0 flex items-stretch gap-3"
                    >
                      <div
                        className="h-full flex items-center gap-2 w-30 max-md:w-20 max-w-30 truncate"
                      >
                        <div
                          className="size-10 max-md:size-6 rounded-full overflow-clip border"
                        >
                          <Image
                            src={post.user?.avatar ?? '/images/users/avatar.png'}
                            width={80}
                            height={80}
                            alt=""
                            className='block size-full object-cover'
                          />
                        </div>
                        <p className="font-semibold max-md:text-sm" >
                          {
                            post.user?.username?.slice(0, 20) ?? 'Unknown'
                          }
                        </p>
                      </div>
                      <div className='w-[1px] bg-gray-500/30' />
                      <p
                        className="truncate min-w-0 flex items-center max-md:text-sm"
                      >
                        {
                          post.title
                        }
                      </p>
                    </div>

                    <p>
                      <time dateTime={post.createdAt}
                        className="text-gray-500 text-sm max-md:text-xs"
                      >
                        {
                          new Date(post.createdAt).toLocaleDateString("en-US")
                        }
                      </time>
                    </p>
                  </Link>
                </li>
              ))
            }
          </ul>
        ): (
          <div>
            <p>
              No Post Yet ...
            </p>
          </div>
        )
      }
    </div>
  )
}

export default RecentPosts