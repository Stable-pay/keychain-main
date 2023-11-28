"use client";

 import { ArrowDownIcon} from "@heroicons/react/24/outline";
 import { useEffect, useState } from "react";
 import dynamic from "next/dynamic";
 import LoadingComponent from "./LoadingComponent";
 import getConversionAmount from "./utils/getConversion";
 import SetCurrency from "./SetCurrency";

 type Props={
     value: string,
     baseCurrency: string,
     setReceiverAmount: (option:string) => void,
     setReceiverCurrency: (option:string) => void,
     setExRate: (option:Number) => void,
 }

 const ExchangeRate = ({value,baseCurrency,setReceiverAmount,setReceiverCurrency,setExRate}:Props) => {
     const [receiverAmount1,setReceiverAmount1]=useState("0.00");
     const [receiverCurrency1,setReceiverCurrency1]=useState<string>("INR");
     const [dropDownOpen,setDropDownOpen]=useState<boolean>(false);
     const [loading,setLoading]=useState(false);
     const [exRate1,setExRate1]=useState(0.0);


     useEffect(() => {
         const fetcher= async () => {
             setLoading(true);
             const rate=await getConversionAmount(baseCurrency,receiverCurrency1,1);
             let val=Number(rate.toFixed(2));
             if(isNaN(val))val=0;
             setExRate1(val);
             setExRate(val);
             setLoading(false);
         }
         fetcher();
         setReceiverCurrency(receiverCurrency1);
         // setDropDownOpen(!dropDownOpen);
     },[receiverCurrency1]);


     useEffect(() => {
         const recevingAmount=exRate1*Number(value);
         const amount_without_commas=Number(recevingAmount.toFixed(2));
         const formattedAmount=amount_without_commas.toLocaleString();
         // console.log(`receevingamount: ${recevingAmount} without commas ${amount_without_commas} formatted: ${formattedAmount}`)
         setReceiverAmount1(formattedAmount);
         setReceiverAmount(formattedAmount);
     },[exRate1,value]);

     const handleDropDown=() => {
         // setCase(input);
         setDropDownOpen(!dropDownOpen);
     }

   return (
     <>
     {dropDownOpen && <SetCurrency isOpen={dropDownOpen} onSelect={(option) => setReceiverCurrency1(option)} toggleDropdown={handleDropDown} />}
     <div className="flex-center w-full">
        <div className="w-1/2 flex flex-col gap-y-1">
            <p className=" text-white-400 md:heading4 body-text pl-8">Receiver Gets:</p>
            <div className="flex w-full items-center">
                <p className=" text-gradient_blue-purple md:heading2 heading3 pl-8">{receiverCurrency1}</p>
                <ArrowDownIcon className="h-7 w-7 text-white pl-2 hover:cursor-pointer" onClick={handleDropDown} />
            </div>
        </div>
        <div className="w-1/2 flex flex-col gap-y-1">
            {loading ? <LoadingComponent />:<p className="text-white-500 md:heading4 body-text">1 {baseCurrency} = {exRate1} {receiverCurrency1}</p>}
            <p className=" text-gradient_purple-blue md:heading2 heading3 flex items-center w-full overflow-auto">{receiverAmount1}</p>
        </div>
    </div>
    </>
   )
 }

 export default ExchangeRate 