"use client";
import { useState } from 'react'
import { QrReader } from 'react-qr-reader'
import dynamic from "next/dynamic"
import LoadingComponent from "./LoadingComponent";
import { useRouter } from 'next/navigation';

// const SendTransactionComponent = dynamic(() => import("./SendTransactionComponent"),{
//     loading: () => <LoadingComponent />
// })

const QrCode = dynamic(() => import('./QRCode'),{
    loading: () => <LoadingComponent />
})

const Scan = () => {
    const [qrActive,setQRActive]=useState("scan");
    const router=useRouter();

    const features=[
        {
            title:"Scan",
            option:"scan",
        },
        {
            title:"My QR Code",
            option:"qr",
        }
    ];
    
  return (
    <div className='mt-5 flex flex-col'>
        {qrActive=="scan"?(
            <div>
        <div className='w-[80vw] md:w-[30vw] flex-center'>
            <div className='h-[80%] w-full flex-center self-center'>
            <QrReader 
                onResult={(result, error) => {
                    if (!!result) {
                    router.push(`/?to=${result?.getText()}`)
                    }
        
                    if (!!error) {
                    console.info(error);
                    }
                }}
                constraints={
                    {
                        // width:'100px',
                        
                        facingMode:'environment'
                    }
                }
                className="h-full w-full -z-10"
            />
        </div>
        </div>
            </div>
        ):(
            <QrCode />
        )
    }
    <div className="flex-center w-full gap-x-4 bottom-0 self-center justify-self-center">
        {features.map(feature => {
            return (
                <div key={feature.option} onClick={() => setQRActive(feature.option)} className={`${qrActive===feature.option?'gradient_blue-purple':''} hover:cursor-pointer text-white-800 whitespace-nowrap rounded-lg px-8 py-3 my-4 capitalize bg-black-300`}>
                    {feature.title}
                </div>
            )
        })}
    </div>
    </div>
  )
}

export default Scan