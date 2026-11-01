import connectToDB from '@/configs/db';
import UserModel from '@/models/User';
import { User } from '@/types/mongooseTypes';
import Image from 'next/image';
import React from 'react'


const RecentUsers = async () => {

  await connectToDB();


  const recentUsersDocs = await UserModel.find(
    {}
  )
  .sort({ _id: -1 })
  .limit(5)
  .lean()

  const recentUsers: User[] = JSON.parse(JSON.stringify(recentUsersDocs));


  await new Promise((res) => setTimeout(res, 3000))


  return (
    <div
      className="border rounded-lg p-5 max-md:p-3"
    >
      <h2 className='mb-4 text-2xl font-semibold' >
        Recent Users
      </h2>
      {
        (recentUsers && recentUsers.length > 0)
        ? (
          <ul>
            {
              recentUsers.map((user) => (
                <li
                  key={user._id}
                >
                  <div
                    className="h-14 border rounded-sm p-2 mb-2 flex gap-2 justify-between items-center bg-sky-300/10"
                  >
                    <div
                      className="w-full min-w-0 flex items-stretch gap-3"
                    >
                      <div
                        className="h-full flex items-center gap-2 w-30 max-w-30 truncate"
                      >
                        <div
                          className="size-10 rounded-full overflow-clip border"
                        >
                          <Image
                            src={user?.avatar ?? '/images/users/avatar.png'}
                            width={80}
                            height={80}
                            alt=""
                            className='block size-full object-cover'
                          />
                        </div>
                        <p className="font-semibold max-md:text-sm" >
                          {
                            user?.username?.slice(0, 20) ?? 'Unknown'
                          }
                        </p>
                        
                      </div>
                      <p className="text-sm text-blue-300 flex items-center max-w-20 truncate min-w-0 max-md:text-xs" >
                          {
                            user?.email?.slice(0, 40) ?? 'Unknown Email'
                          }
                        </p>
                    </div>

                    <p>
                      <time dateTime={new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toISOString()}
                        className="text-gray-500 text-sm max-md:text-xs"
                      >
                        {
                          new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toLocaleDateString("en-US")
                        }
                      </time>
                    </p>
                  </div>
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

export default RecentUsers