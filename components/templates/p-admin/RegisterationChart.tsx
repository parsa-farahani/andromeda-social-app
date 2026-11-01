import React from 'react'
import DailyChart from './charts/DailyChart'
import { getDailyCounts } from '@/utils/stats/dbStats';
import connectToDB from '@/configs/db';
import UserModel from '@/models/User';

const RegisterationChart = async () => {


   await connectToDB();

   const data = await getDailyCounts(UserModel, 30);
   
   const formattedData = data.map(({ date, count }) => (
      {
         date: date.slice(date.indexOf('-') + 1),
         count,
      }
   ))

   const total = data.reduce((sum, d) => sum + d.count, 0)

   await new Promise(res => setTimeout(res, 1000))

  return (
    <div
      className=" rounded-lg p-5 "
    >
      <div className='mb-4' >
         <h2 className='mb-2 text-2xl font-semibold' >
         Users Registerations
         </h2>
         <p className='text-sm text-gray-500 mb-10' >
            <span className="text-white mr-2 border border-(--color-reg-count) text-black inline-flex px-2 gap-1 items-center justify-center h-7 rounded-full" >
               <span>
                  {total}
               </span>
               <span>
                  Users
               </span>
            </span>
            in the last 30 days
         </p>
      </div>
      <DailyChart
         data={
           formattedData
         }
         lineColor="var(--color-reg-count)"
         label="Registerations"
         allowDecimalsY={false}
      />
   </div>
  )
}

export default RegisterationChart