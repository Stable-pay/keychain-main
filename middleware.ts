import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers';
import { isAuthenticated } from './lib/auth';
import { getDataFromId } from './components/utils/getDatafromId';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const auth=isAuthenticated();
  const path=request.nextUrl.pathname;
  if(!auth && path.startsWith("/account")){
    return NextResponse.redirect(new URL('/login/',request.url));
  }

  // console.log("req url :",request.nextUrl);
  if(path.startsWith("/payments/") && !auth){
    return NextResponse.redirect(new URL('/login/',request.url));
  }

  if(path.startsWith("/history") && !auth){
    return NextResponse.redirect(new URL('/login/',request.url));
  }

  if(path==="/" && !auth){
    return NextResponse.redirect(new URL('/login/',request.url));
  }

  // const getSendData:any=getDataFromId();
  // if(path==='/send' && !getSendData){
  //   if(getSendData?.receiverAddress!==''){
  //     return NextResponse.rewrite(new URL('/send/user',request.url));
  //   }else{
  //     return NextResponse.rewrite(new URL('/send/link',request.url));
  //   }
  // }

  // if(path.startsWith("/") && !auth){
  //   return NextResponse.redirect(new URL('/account/',request.url));
  // }

  // return NextResponse.redirect(new URL('/account'));
}
