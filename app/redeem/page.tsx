import { isAuthenticated } from "@/lib/auth";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

function RedeemPageSkeleton(){
  return (
    <div className="text-white-400 flex-center font-bold heading2 bg-black-100 w-screen h-screen flex-col gap-y-4">
        <p><b className="text-gradient_pink-orange">Please install the app and login</b> and paste following link in Redeem Funds Page <b className="text-gradient_blue-purple">to claim your funds.</b></p>
        <Link href={"/"} className="gradient_pink-orange text-white rounded-3xl p-4">Install</Link>
    </div>
  )
}

export default async function RedeemPage(){
    const redirectButton=async (formdata:FormData) => {
        "use server";
        const url=formdata.get('claimlink');
        const hash=new URL(url as string).searchParams.get('hash');
        if(!hash){
          return ;
        }
        redirect(`/payments/${hash}`);
    }
  return (
    <>
    {
      isAuthenticated()?(
        <div className="h-[85vh] w-screen flex-center">
          <form action={redirectButton} className='h-[85vh] w-screen md:w-[60vw] bg-black-400 rounded shadow-md flex-center flex-col gap-y-3'>
              <div className='text-white-400 heading2 md:heading1 p-4'>Paste the link here</div>
              <input name='claimlink' type="text" placeholder='Enter your link here' className='outline-none p-4 rounded shadow-md border-blue-300 w-[70%]' required={true} />
              <button type="submit" >
              <ArrowRightCircleIcon className="h-10 w-10 md:h-12 md:w-12 text-white-800" />
              </button>
          </form>
        </div>
      ):(
        <RedeemPageSkeleton />
      )
    }
    </>
  )
}