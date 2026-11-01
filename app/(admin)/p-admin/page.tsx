import InfoCards from '@/components/templates/p-admin/InfoCards';
import InfoHeader from '@/components/templates/p-admin/InfoHeader';
import PostsChart from '@/components/templates/p-admin/PostsChart';
import RecentPosts from '@/components/templates/p-admin/RecentPosts';
import RecentUsers from '@/components/templates/p-admin/RecentUsers';
import RegisterationChart from '@/components/templates/p-admin/RegisterationChart';
import ChartSkeleton from '@/components/templates/p-admin/skeletons/index/ChartSkeleton';
import InfoCardsSkeleton from '@/components/templates/p-admin/skeletons/index/InfoCardsSkeleton';
import RecentSkeleton from '@/components/templates/p-admin/skeletons/index/RecentSkeleton';
import { authAdmin } from '@/utils/serverHelpers'
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react'


const AdminPanel = async () => {

  const admin = await authAdmin();

  if (!admin) {
    redirect('/p-user')
  }

  return (
    <div className='w-full'>
      
      <InfoHeader
        user={admin}
        withEdit
      />

      <hr className='mb-3' />

      <div className='flex flex-col gap-x-3 gap-y-15 p-5 max-md:p-3 pb-20' >

        <Suspense
          fallback={<InfoCardsSkeleton />}
        >
          <InfoCards />
        </Suspense>


        
          <section
            className='grid lg:grid-cols-2 gap-3'
          >
            <Suspense
              fallback={<ChartSkeleton />}
            >
                <RegisterationChart />
            </Suspense>

            <Suspense
              fallback={<ChartSkeleton />}
            >
                <PostsChart />
            </Suspense>
          </section>

        <section
          className='w-full grid md:grid-cols-2 gap-3'
        >
          <Suspense
            fallback={<RecentSkeleton />}
          >
            <RecentPosts />
          </Suspense>
          <Suspense
            fallback={<RecentSkeleton />}
          >
            <RecentUsers />
          </Suspense>
        </section>
        
      </div>
    </div>
  )
}

export default AdminPanel