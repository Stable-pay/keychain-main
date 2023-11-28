"use client";
import { ArrowDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import React, { useLayoutEffect, useMemo, useState } from 'react'
import SetCurrency from './SetCurrency';
import getConversionAmount from './utils/getConversion';

type Props = {
    baseCurrency:string,
}
const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

export function ExchangeRateComponentSkeleton({baseCurrency}:Props) {
    return (
        <div className="bg-black-300">
            <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
        </div>
    )
}

const ExchangeRateComponent = ({baseCurrency}: Props) => {
    const [receiver_currency,setReceiverCurrency]=useState("INR");
    const [exRate,setExrate]=useState(0.0);
    const [dropDownOpen,setDropDownOpen]=useState(false);
    const [value,setValue]=useState('');
    useLayoutEffect(() => {
        const getExRate=async () => {
            const exRateFetched=await getConversionAmount(baseCurrency,receiver_currency,1);
            setExrate(Number(exRateFetched.toFixed(2)));
        }
        getExRate();
    },[receiver_currency]); 

    const recevingAmount=exRate*Number(value);
    const amount_without_commas=Number(recevingAmount.toFixed(2));
    const formattedAmount=amount_without_commas.toLocaleString();

    const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>) => {
        // const newValue=e.target.value;
        // if (/^(?:\d+|\d*\.\d+)$/.test(newValue)) {
        //     setValue(newValue);
        //   }
        e.preventDefault();
        const newValue=e.target.value;
        if(Number(newValue)<0 )return ;
        setValue(newValue);
    }

  return (
    <>
    <div className="flex-col gap-y-5 flex">
          <div className="flex-center gap-x-4 w-full">
              <div className="flex flex-col justify-center gap-y-1 w-1/2 pl-8">
                  <p className="text-white-400 md:heading4 body-text">You Send:</p>
                  <p className="text-gradient_blue-purple md:heading2 heading3">{baseCurrency}</p>
              </div>
              <input style={{appearance:'none',outline:'none'}} name="sentAmount" inputMode='decimal' type="number" value={value} step={0.01} onChange={handleInputChange} required={true} className={`outline-none border-[6px] no-scrollar w-1/2 flex-center text-gray-500 bg-white-800 rounded-md p-4 md:text-2xl body-text max-w-full`} placeholder="Enter Amount" />
          </div>
          <ArrowsUpDownIcon className="h-7 w-7 text-white-400 hover:cursor-pointer ml-[56px]" />
      </div>
    <div className="flex-center w-full">
        {dropDownOpen && <SetCurrency onSelect={(currency_code) => setReceiverCurrency(currency_code)} toggleDropdown={() => setDropDownOpen(!dropDownOpen)} />}
        <input className='hidden' hidden={true} name="receiver_currency" value={receiver_currency} onChange={(e) => setReceiverCurrency(e.target.value)} />
    <div className="w-1/2 flex flex-col gap-y-1">
        <p className=" text-white-400 md:heading4 body-text pl-8">Receiver Gets:</p>
        <div className="flex w-full items-center">
            <p className=" text-gradient_blue-purple md:heading2 heading3 pl-8">{receiver_currency}</p>
            <ArrowDownIcon className="h-7 w-7 text-white pl-2 hover:cursor-pointer" onClick={() => setDropDownOpen(!dropDownOpen)} />
        </div>
    </div>
    <div className="w-1/2 flex flex-col gap-y-1">
        <p className="text-white-500 md:heading4 body-text">1 {baseCurrency} = {exRate} {receiver_currency}</p>
        <p className=" text-gradient_purple-blue md:heading2 heading3 flex items-center w-full">{formattedAmount}</p>
    </div>
    <input hidden={true} className='hidden' name="sender_currency" value={baseCurrency} onChange={() => {}} />
    <input hidden={true} className='hidden' name="exchangeRate" value={exRate} onChange={() => {}} />
</div>
    </>
  )
}

export default ExchangeRateComponent