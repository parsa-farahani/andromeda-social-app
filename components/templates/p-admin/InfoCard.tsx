import Link from 'next/link';
import React, { ReactNode } from 'react'

interface InfoCardProps {
   href: string;
   title: string;
   value: number;
   newThisWeek: number;
   icon: ReactNode;
}

const InfoCard = (
   {
      href,
      title,
      value,
      newThisWeek,
      icon
   }: InfoCardProps
) => {

  return (
    <Link
      href={href}
      className='border border-transparent rounded-lg py-3 px-5 flex gap-5 hover:bg-white/10 hover:border-gray-500/50 transition bg-white/5'
      >
      <div className='flex items-center' >
         {
            icon
         }
      </div>
      <div
         className='grow flex flex-col gap-y-1'
      >
         <h3 className='text-lg' >
            {
               title
            }
         </h3>
         <p
            className='text-4xl max-md:text-1xl'
         >
            {
               value.toLocaleString()
            }
         </p>
         {
            newThisWeek
            && (
               <p
                  className="text-sm text-green-300"
               >
                  +{newThisWeek} New this week
               </p>
            )
         }
      </div>
      </Link>

  )
}

export default InfoCard