import { getAddress } from '@/app/actions';
import { offRampFunction } from '@/components/utils/getConversion';
import { getDataFromId } from '@/components/utils/getDatafromId'
import React, { Suspense } from 'react'
import Form from './Form';


type Props = {
  senderAddress:string,
    receiverAddress:string,
    exchangeRate:number,
    sender_currency:string,
    receiver_currency:string,
    sentAmount:number,
    note:string,
    usdc_transferred:number,
}

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

export function FinalFormSkeleton(){
  return (
    <div className={`h-[80vh] w-full md:w-3/4 lg:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around gap-y-1`}>
            <div className="bg-black-300">
              <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
            </div>
            <div className="bg-black-300">
              <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
            </div>
            <div className="bg-black-300">
              <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
            </div>
            <div className="bg-black-300">
              <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
            </div>
            <div className="bg-black-300">
              <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
            </div>
          </div>
  )
}


const page = async () => {
    const confirmData:any=await getDataFromId();
    console.log('send via user:',confirmData);

    const smartContractAddress=getAddress();
    const exchangeRate:any=await offRampFunction(confirmData?.sender_currency || "USD");

    let usdc_transferred=Number(confirmData?.sentAmount)/exchangeRate?.amount;
    if(isNaN(usdc_transferred)){
      usdc_transferred=0;
    }
    console.log('usdc transfer:',usdc_transferred);
    const transaction:Props={...confirmData,senderAddress:smartContractAddress,usdc_transferred};
    
  return (
    <Suspense fallback={<FinalFormSkeleton />}>
      <Form transaction={transaction}  />
    </Suspense>
  )
}

export default page