"use client";
// import { isAuthenticated } from '@/lib/auth';
import { ClockIcon, HomeIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link'
import { useLayoutEffect, useState } from 'react';
import { getAddress } from './utils/getAddress';

const Footer = () => {
  // const {zeroDevReady}=usePrivySmartAccount();
  const [loggedIn,setLoggedIn]=useState(false);
  useLayoutEffect(() => {
    setLoggedIn(getAddress()!=='');
  },[getAddress()]);
  return (
    <>
    {loggedIn && (<footer className="text-white-800 mt-2  bottom-0 left-0 flex justify-evenly w-full mb-2 z-auto"
    >
      <div className='rounded-full p-4 hover:cursor-pointer gradient_blue-purple shadow-md shadow-white-400'>
        <Link href="/">
        <HomeIcon className='h-6 w-6 md:h-8 md:w-8' />
        </Link>
      </div>
      <div className='rounded-full p-4 hover:cursor-pointer gradient_blue-purple shadow-md shadow-white-400'>
        <Link href="/history">
          <ClockIcon className='h-6 w-6 md:h-8 md:w-8' />
        </Link>
      </div>
      <div className='rounded-full p-4 flex-center hover:cursor-pointer gradient_blue-purple shadow-md shadow-white-400'>
        <Link href="/redeem">
          <SquaresPlusIcon className='h-6 w-6 md:h-8 md:w-8' />
        </Link>
      </div>
    </footer>)}
    </>
  )
}

export default Footer