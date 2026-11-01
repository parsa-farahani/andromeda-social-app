// import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "./utils/auth";


const PROTECTED_PREFIXES = ['/p-user'];


export async function proxy(req: NextRequest) {
   
   console.log(`🟣 Middleware - path: ${req.nextUrl.pathname}`)

   // const cookieStore = await cookies();

   const { pathname, search } = req.nextUrl;

   const accessToken = req.cookies.get('token')?.value;
   const refreshToken = req.cookies.get('refresh-token')?.value;

   // if we have a valid 'access-token', user can continue
   if (accessToken) {
      const payload = verifyAccessToken(accessToken);

      if (payload?.email) {
         console.log('🐲 token is valid - tokenPayload -> ', payload)
         return NextResponse.next();
      }
   }

   console.log('🚫 token expired')

   if (refreshToken) {

      console.log('🔃 Refreshing Token')

      const res = await fetch(new URL('/api/auth/refresh', req.url), {
         method: 'POST',
         headers: { cookie: `refresh-token=${refreshToken}` },
      })


      if (res.ok) {
         const { accessToken: newToken } = await res.json();

         // we put new access token, for the request which is going to go from this middleware, to request-destination
         const requestHeaders = new Headers(req.headers);

         const oldCookies = req.headers.get('cookie') ?? '';

         const cleaned = oldCookies
            .split(';')
            .map(c => c.trim())
            .filter(c => c && !c.startsWith('token='))
            .join('; ')
         ;
         
         requestHeaders.set(
            'cookie',
            `${cleaned}; token=${newToken}`
         )
         

         const response = NextResponse.next(
            {
               request: { headers: requestHeaders }
            }
         )

         // also we put new access-token in 'response' which is returned from destination and going back to 'browser'
         response.cookies.set(
            'token',
            newToken,
            {
               path: '/',
               httpOnly: true,
               maxAge: 60 * 15,
            }
         )

         return response;
      }
   }
   


   // No refresh-token nor access-token -> Not any valid-session

   const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));


   if (isProtected) {
      return NextResponse.redirect(new URL(`/signin?return_url=${pathname}${search}`, req.url));
   }

   
   // Public pages -> allow Guest-User to continue
   return NextResponse.next();
}


export const config = {
   matcher: [
      // '/p-user/:path*',
      '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js)$).*)',
   ]
}