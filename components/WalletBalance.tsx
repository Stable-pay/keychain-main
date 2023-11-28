// "use client";
import { getBalance, getBaseCurrency } from "@/app/actions";
import { cookies } from "next/headers";
// import { isAuthenticated } from "@/lib/auth";
// import { useCurrencyStore } from "@/store/CurrencyStore"
// import { useCallback } from "react";
import { offRampFunction } from "./utils/getConversion";

export function WalletBalanceSkeleton() {
    return (
        <div className="flex-center flex-col gap-x-2 gap-y-2">
            <p className="text-gradient_pink-orange heading2 md:heading1">{0.00} <span className='heading4 md:heading3'>{"USD"}</span></p>
            <p className="text-white-400 md:heading4 body-text">Total balance</p>
        </div>
    )
}

type Props={
    baseCurrency:string,
}

export default async function WalletBalance({baseCurrency}:Props) {
    // const isLoggedIn=isAuthenticated();
    // if(!isLoggedIn){
    //     return <></>;
    // }

    
    const getBalanceInUSDC=(balance:any,rate:any) => {
        const conversionFromGeitoNormalCurrency=Number(balance)/10**6;
          let value=(conversionFromGeitoNormalCurrency).toFixed(2);
          if(isNaN(Number(value)))value="0.00";
          if(isNaN(rate))rate=0.0;
          const balanceToShow=(rate*Number(value)).toFixed(2);
          console.log("wallet balance:",balanceToShow);
          return balanceToShow;
    }
    const [walletBalanceRateData,walletBalance]=await Promise.all([offRampFunction(baseCurrency),getBalance()]);
    
    const walletBalanceRate=walletBalanceRateData?.amount;
    return (
        <div className="flex-center flex-col gap-x-2 gap-y-2">
            <p className="text-gradient_pink-orange heading2 md:heading1">{getBalanceInUSDC(walletBalance,walletBalanceRate)} <span className='heading4 md:heading3'>{baseCurrency}</span></p>
            <p className="text-white-400 md:heading4 body-text">Total balance</p>
        </div>
    )
}