"use client";
import { usePrivySmartAccount } from '@zerodev/privy';
import { useEffect } from 'react'
import dynamic from "next/dynamic";
import LoadingComponent from './LoadingComponent';
import { create } from '@/app/actions';
import useStandaloneMode from './hooks/useStandalone';
import { useSearchParams } from 'next/navigation';

const Body=dynamic(() => import("./Body"),{
    loading:() => <LoadingComponent />
})

const Install=dynamic(() => import("./Install"),{
    loading:() => <LoadingComponent />
})


type Props = {
    feature:string | string[] | undefined,
}

const Login = () => {
    const {user,zeroDevReady}=usePrivySmartAccount();
    const isStandaloneMode=useStandaloneMode();
    const searchParams=useSearchParams();
    const feature=searchParams.get('feature') || "";

    useEffect(() => {
        const userData=setInterval(async () => {
            // if(!zeroDevReady){
            //     const refreshToast=toast.loading('Setting Up, please wait...',{
            //         duration:1000*4,
            //     });
                
            //     await login();
            //     // toast.success('You are ready to delve into global payments!!',{
            //     //     id:refreshToast
            //     // });
            // }
            // if(zeroDevReady){
            //     create(user?.wallet?.address || "");
            // }
        },1000*4);
        return () => clearInterval(userData);
    },[zeroDevReady]);
  return (
    <>
        {!isStandaloneMode && <Install />}
    {isStandaloneMode && <div className=''>
        <section className=''>
            {/* <FormComponent /> */}
            {zeroDevReady && <Body feature={feature} />}
            {/* {!zeroDevReady && (
                <div className='flex-center flex-col gap-y-2'>
                    <LoginComponent />
                    <button onClick={login} className="rounded gradient_pink-orange p-4 px-6 text-white-800 shadow-md">Login</button>
                </div>
            )} */}
        </section>
    </div>}
    </>

  )
}

export default Login