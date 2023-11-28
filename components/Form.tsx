import { getAddress, getBalance, getBaseCurrency } from "@/app/actions"
import { Suspense } from "react"
import AddFundsButton from "./AddFundsButton";
import ExchangeRateComponent, { ExchangeRateComponentSkeleton } from "./ExchangeRateComponent";
import WalletBalance, { WalletBalanceSkeleton } from "./WalletBalance"
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

export function FormSkeleton(){
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
          </div>
  )
}

const Form = async () => {
  const walletBalance=await getBalance();
  const baseCurrency=getBaseCurrency();
    console.log("balance:",walletBalance);
    const handleSubmit=async (formdata:FormData) => {
        "use server";
        console.log("formdata:",formdata);
        const token=jwt.sign(Object.fromEntries(formdata),process.env.TOKEN_SECRET!);
        console.log('token',token);
        // const redirectToNextPage=await fetch("localhost:3000/api/submit",{
        //   headers:{
        //     'Content-Type':'application/json',
        //   },
        //   method:"POST",
        //   body:JSON.stringify(token),
        // }).then(res => res.json());
        cookies().delete('sendOptions');
        cookies().set('sendOptions',token,{
          httpOnly:true,
        });
        redirect(`/${token}`);
    }
  return (
    <form action={handleSubmit} className={`h-[80vh] w-full md:w-3/4 lg:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around gap-y-1`}>
     
        {/* Wallet Balance */}
        <Suspense fallback={<WalletBalanceSkeleton />}>
            <WalletBalance baseCurrency={baseCurrency} />
        </Suspense>

        {/* handleAmountInput */}
        {/* <div className="flex-col gap-y-5 flex">
          <div className="flex-center gap-x-4 w-full">
              <div className="flex flex-col justify-center gap-y-1 w-1/2 pl-8">
                  <p className="text-white-400 md:heading4 body-text">You Send:</p>
                  <p className="text-gradient_blue-purple md:heading2 heading3">{baseCurrency}</p>
              </div>
              <input style={{appearance:'none',outline:'none'}} name="amount" inputMode='decimal' required={true} className={`outline-none border-[6px] no-scrollar w-1/2 flex-center text-gray-500 bg-white-800 rounded-md p-4 md:text-2xl body-text max-w-full`} placeholder="Enter Amount" />
          </div>
          <ArrowsUpDownIcon className="h-7 w-7 text-white-500 hover:cursor-pointer ml-[56px]" />
      </div> */}

        {/* Exchange Rate */}
        <Suspense fallback={<ExchangeRateComponentSkeleton baseCurrency={baseCurrency} />}>
          <ExchangeRateComponent baseCurrency={baseCurrency} />
        </Suspense>

        <div className="flex justify-evenly">
          <AddFundsButton />
          <button type="submit" className='gradient_purple-blue text-white rounded-2xl p-4 hover:cursor-pointer'>Send Funds</button>
        </div>

    </form>
  )
}

export default Form