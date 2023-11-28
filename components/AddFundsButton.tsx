"use client";

import { KoyweRampSDK } from "@koyweforest/koywe-ramp-sdk";
import { usePrivySmartAccount } from "@zerodev/privy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SetCurrency from "./SetCurrency";
import { getAddress } from "./utils/getAddress";



const AddFundsButton = () => {
    const [currenciesOpen,setCurrenciesOpen]=useState(false);
    const router=useRouter();
    const {user}=usePrivySmartAccount();
    const onCurrencySelection = (currency_code:string) => {
        const koyweCurrencies = ["CLP", "MXN","PEN","COP"];
        if(koyweCurrencies.includes(currency_code)){
            const koywe = new KoyweRampSDK({
                clientId: process.env.NEXT_PUBLIC_KOYWE_ID!,
                address: user?.wallet?.address || getAddress(),
                tokens: ["USDC Polygon"],
                callbackUrl: "http://stable-pay-mukul202.vercel.app/account",
                currencies:[currency_code],      
              });
              koywe.show();
        }else if(currency_code==="INR"){
            router.push(`https://onramp.money/main/buy/?appId=625451&walletAddress=${user?.wallet?.address}`)
        }else {
            //future
        }
    }
  return (
    <>
      {
          currenciesOpen?(
            <SetCurrency onSelect={onCurrencySelection} toggleDropdown={() => setCurrenciesOpen(!currenciesOpen)} />
        ):(
            <div className='gradient_purple-blue text-white rounded-2xl p-4 hover:cursor-pointer' onClick={() => setCurrenciesOpen(!currenciesOpen)}>Add funds</div>
        )
    }
    </>
  )
}

export default AddFundsButton