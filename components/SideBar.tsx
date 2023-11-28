"use client";
import { userStore } from '@/store/UserStore'
import { ArrowLeftCircleIcon, Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline'
import { usePrivySmartAccount } from '@zerodev/privy';
import { useRouter } from 'next/navigation'
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';

type Props = {
    setSideBarOpen: (value: React.SetStateAction<boolean>) => void,
    sideBarOpen: boolean
}

const SideBar = () => {
    const {user,zeroDevReady}=usePrivySmartAccount();
    const [smartContractAddress,setSmartContractAddress]=useState<string|undefined>(undefined);
    const [sideBarOpen,setSideBarOpen]=useState(false);
    const router=useRouter();
    const handleClick=async () => {
        setSideBarOpen(false);
        router.push("/account");
    }
    useEffect(() => {
        setSmartContractAddress(user?.wallet?.address);
    },[zeroDevReady]);

    if(!smartContractAddress){
        return null;
    }

  return (
    <div className={`z-1000 fixed top-0 left-0`}>
            <Bars3Icon className='fixed top-0 left-0 h-12 w-12 text-black bg-white m-4 rounded hover:cursor-pointer' 
                onClick={() => setSideBarOpen(!sideBarOpen)}
            />
        {/* <div className='fixed h-8 w-8 p-7 m-7 bg-white text-gray-500 hover:cursor-pointer rounded-full'>
            <Bars3Icon  onClick={() => setSideBarOpen(!sideBarOpen)} />
        </div> */}
        <div className={`h-screen w-screen z-100 fixed backdrop-blur-md ${sideBarOpen?'':'hidden'}`}>
        <div className={`bg-white h-screen w-full md:w-1/2 lg:w-1/3 border border-r-2 flex flex-col justify-around ${sideBarOpen?'':'hidden'}`}>
            <ArrowLeftCircleIcon className='fixed top-0 left-0 h-12 w-12 m-4 border rounded-full hover:bg-purple hover:cursor-pointer' 
                onClick={() => setSideBarOpen(false)}
            />
            <div className='flex mx-5 justify-around text-gray-700'>
                <UserCircleIcon className='h-full w-1/4' />
                <div className='flex flex-col'>
                    <p className='text-gray-500'>{`${smartContractAddress.substring(0,7)}...${smartContractAddress.substring(smartContractAddress.length-3)}`}</p>
                    <p className='border rounded-md border-black border-[3px] flex-1 h-full mb-2 flex items-center justify-center hover:cursor-pointer p-6 gradient_blue-purple' onClick={handleClick}>Account</p>
                </div>
                
            </div>
            <div className='flex flex-col items-center'>
                <button className='border border-blue-500 rounded-md p-2 m-2 w-1/2 gradient_pink-orange' onClick={() => {
                    setSideBarOpen(false);
                    router.push("/");
                }}>Home</button>
                <button className='border border-blue-500 rounded-md p-2 m-2 w-1/2 gradient_pink-orange' onClick={() => {
                    setSideBarOpen(false);
                    router.push("/?feature=scan");
                }}>Scan/QR </button>
            </div>
            <div className='flex flex-col items-center'>
                <button className='border border-blue-500 rounded-md p-2 m-2 w-1/2 hover:bg-purple' onClick={() => {
                    setSideBarOpen(false);
                    router.push("/qr");
                }}>Terms and Conditions</button>
                <button className='border border-blue-500 rounded-md p-2 m-2 w-1/2 hover:bg-purple' onClick={() => {
                    setSideBarOpen(false);
                    router.push("/qr");
                }}>Privacy Policy</button>
                <button className='border border-blue-500 rounded-md p-2 m-2 w-1/2 hover:bg-purple' onClick={() => {
                    setSideBarOpen(false);
                    router.push("/qr");
                }}>Cookie Policy</button>
            </div>
        </div>
        </div>
    </div>
  )
}

export default SideBar