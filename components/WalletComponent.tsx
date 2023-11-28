"use client";
import { getBalance } from '@/app/actions';
import { useCurrencyStore } from '@/store/CurrencyStore';
import { usePrivySmartAccount } from '@zerodev/privy';
import { useEffect, useState } from 'react';
import { offRampFunction } from './utils/getConversion';

type Props={
    baseCurrency?:string,
}
  
const WalletComponent = (props:Props) => {
    
    const [walletBalance,setWalletBalance]=useState<string>("0.00");
    const {zeroDevReady}=usePrivySmartAccount();
    const [baseCurrency]=useCurrencyStore(state => [state.baseCurrency]);
    const [rate,setRate]=useState(0.0);
    useEffect(() => {
      const getWalletbalance = async () => {
        const data=await getBalance(); // wallet balance in matic/usdc
        if(data){
          const conversionFromGeitoNormalCurrency=Number(data)/10**6;
          let value=(conversionFromGeitoNormalCurrency).toFixed(2);
          if(isNaN(Number(value)))value="0.00";
          if(isNaN(rate))setRate(0.0);
          console.log("rate:",rate);
          setWalletBalance((rate*Number(value)).toFixed(2));
        }
      }
      getWalletbalance();
      const intervalId=setInterval(getWalletbalance,1000*5);
      // console.log("Balance fetched");
      return () => clearInterval(intervalId);
    },[zeroDevReady,rate]);

    useEffect(() => {
        const getWallet=async () => {
            // const data=await fetcher(uri); // wallet balance in matic/usdc
            // if(walletBalance){
                const rate:any=await offRampFunction(baseCurrency || "");// 1usdc in baseCurrency
                const NumberRate=Number(rate?.amount);
                // const conversionFromGeitoNormalCurrency=Number(walletBalance)/10**18;
                // let value=(NumberRate*conversionFromGeitoNormalCurrency).toFixed(2);
                // let value=(NumberRate*Number(walletBalance)).toFixed(2);
                // if(isNaN(Number(value)))value="0.00";
                setRate(NumberRate);
            // }
        }
        getWallet();
    },[baseCurrency]);
  
    return (
        <div className="flex-center flex-col gap-x-2 gap-y-2">
            <p className="text-gradient_pink-orange heading2 md:heading1">{walletBalance} <span className='heading4 md:heading3'>{baseCurrency}</span></p>
            <p className="text-white-400 md:heading4 body-text">Total balance</p>
        </div>
    );
};

export default WalletComponent;