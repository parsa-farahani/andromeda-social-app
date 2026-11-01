'use client'

import '@/styles/globals.css'

const GlobalError = ({ reset }: { reset: () => void }) => (
   <html lang="en">
      <body className="dark min-h-svh flex flex-col items-center justify-center gap-4 text-center p-6">
         <h2 className="text-2xl font-semibold">Something went wrong</h2>
         <button
            onClick={reset}
            className="rounded-md bg-white/10 hover:bg-white/20 px-4 py-2 text-sm transition"
         >
            Try again
         </button>
      </body>
   </html>
)

export default GlobalError