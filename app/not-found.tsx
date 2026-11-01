import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {


  return (
    <div className="container h-svh flex-center" >
      <div className='flex flex-col gap-5 items-center' >
         <p
            className='text-2xl'
            >
            404 - Not Found the Page !
         </p>
         <Link 
            href="/"
            className='border p-2 rounded-lg flex items-center gap-2 w-fit'
         >
            Return to Home Page
            <ArrowRight className='size-5' />
         </Link>
      </div>
    </div>
  )
}

export default NotFound