"use client";
import { ArrowDownIcon, PlusCircleIcon, UserCircleIcon, WalletIcon } from '@heroicons/react/24/outline';
// import { useWallets } from '@privy-io/react-auth';
import { usePrivySmartAccount } from '@zerodev/privy';
import { useEffect, useMemo, useState } from 'react';
import clipboard from 'clipboard-copy';
import toast from "react-hot-toast";
import Link from 'next/link';
import SetCurrency from '@/components/SetCurrency';
import { DeleteCookies, getAddress, setBaseCurrencyCookie } from '../actions';
import { useCurrencyStore } from '@/store/CurrencyStore';
import { useRouter } from 'next/navigation';
import { KoyweRampSDK } from '@koyweforest/koywe-ramp-sdk';
import { revalidatePath } from 'next/cache';
import WithdrawFundsButton from '@/components/WithdrawButton';

type Props = {}
// export const revalidate=300;

const Page = (props: Props) => {
    const {linkEmail,linkDiscord,linkGoogle,linkTwitter,linkPhone,user,zeroDevReady,login,logout}=usePrivySmartAccount();
    const smartContractAddress=user?.wallet?.address || "";
    const [baseCurrency,setBaseCurrency]=useCurrencyStore(state => [state.baseCurrency,state.setBaseCurrency]);
    const [dropDown,setDropDown]=useState(false);
    const [withdraw,setWithdraw]=useState(false);
    const router=useRouter();
    const koywe=new KoyweRampSDK({clientId:process.env.NEXT_PUBLIC_KOYWE_ID!,address:getAddress() as string,tokens:["USDC Polygon"]})

    const linkOptions=[
        {label:"Email",action:linkEmail,code:"email"},
        {label:"Phone",action:linkPhone,code:"phone"},
        {label:"Google",action:linkGoogle,code:"google_oauth"},
        {label:"Discord",action:linkDiscord,code:"discord"},
        {label:"Twitter",action:linkTwitter,code:"twitter"},
       ]

    // const {wallets}=useWallets();

    const linkedOrNot= (code:string) => {
        if(!zeroDevReady)return false;
        const index=user.linkedAccounts?.findIndex(element => element.type===code);
        return index!=-1;
    }

    const handleSelection=async (option:string) => {
        setBaseCurrency(option);
        await setBaseCurrencyCookie(option);
    }

    const handleDropDown=async () => {
        setDropDown(!dropDown);
    }

    const handleCopy=async (e: React.MouseEvent<HTMLInputElement>) => {
        if(smartContractAddress==="")return ;
        try {
            const copyingToast=toast.loading("Copying to clipboard...");
            await clipboard(smartContractAddress as string);
            toast.success("Successfully copied!",{
                id:copyingToast
            })
        } catch (err) {
            console.error('Failed to copy to clipboard: ', err);
        }
    }

    const handleLogout=async () => {
        await logout();
        await DeleteCookies();
        localStorage.clear();
        router.push("/login");
    }

  return (
    <div className='flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500'>
        {dropDown && <SetCurrency isOpen={dropDown} onSelect={handleSelection} toggleDropdown={handleDropDown} isBaseCurrency={true} />}
        {withdraw && <WithdrawFundsButton isOpen={withdraw} toggleWithdraw={() => setWithdraw(!withdraw)}/>}
        <div className='flex h-[85vh] w-full flex-col items-center self-center md:w-1/2 rounded-md shadow-lg bg-black-300 py-4 overflow-auto no-scrollbar'>
            <p className='font-bold text-2xl text-gradient_pink-orange'>Account</p>
            <div className='flex mt-4 justify-center items-center text-gray-500'>
                <WalletIcon className='h-12 w-12' />
                <p>Wallets</p>
            </div>
            <p className='text-gray-400'>Connect and link Wallets to your account</p>
            <div className='border border-blue-400 rounded-md flex justify-between p-2 items-center w-4/5 m-4'>
                <p className='text-gray-400'>{`${smartContractAddress.substring(0,7)}...${smartContractAddress.substring(smartContractAddress.length-3)}`}</p>
                <span onClick={handleCopy} className='text-gray-400 p-2 rounded-md hover:cursor-pointer'>Copy</span>
            </div>
            <div className='w-full flex flex-col my-2'>
                <div className='text-gray-600 flex justify-center items-center'>
                    <UserCircleIcon className='h-8 w-8' />
                    <p className='text-gray-400'>Linked Socials</p>
                </div>
                {linkOptions.map((element,index) =>  {
                    return (
                    <div key={index} className='border flex justify-between items-center w-full md:w-3/4 self-center rounded-md p-2 my-1 mx-2'>
                        <p className='text-gray-300'>{element.label}</p>
                        <PlusCircleIcon 
                        className={`${linkedOrNot(element.code)?'hidden':''} h-8 w-8 gradient_pink-orange rounded-full text-white hover:cursor-pointer`} 
                        onClick={element.action} />
                        <p className={`${linkedOrNot(element.code)?'':'hidden'} text-gray-400`}>Already Linked</p>
                    </div>
                )})}
            </div>
            
            <div className="flex w-full md:w-3/4 items-center justify-between py-4">
                <div className='body-text md:heading4 text-gray-500'>
                    Default Base Currency
                </div>
                <div className='flex items-center'>
                <p className=" text-gradient_blue-purple md:heading2 heading3 pl-8">{baseCurrency}</p>
                <ArrowDownIcon className="h-7 w-7 text-white pl-2 hover:cursor-pointer" onClick={handleDropDown} />
                </div>
            </div>
            {zeroDevReady && (
                <div className='w-5/6 flex items-center justify-evenly mt-4'>
                    {/* <button className='bg-green-500 text-white rounded-3xl p-4'>Add funds</button> */}
                    <button className='gradient_pink-orange text-white rounded-3xl p-4' onClick={() => setWithdraw(!withdraw)}>Withdraw Funds</button>
                    {/* <Link href={`https://onramp.money/main/sell/?appId=625451&coinCode=usdc`}> */}
                        {/* <button className='gradient_pink-orange text-white rounded-3xl p-4' onClick={koywe.show}>Withdraw Funds</button> */}
                    {/* </Link> */}
                    <button className='gradient_pink-orange text-white rounded-3xl p-4' onClick={handleLogout}>Log Out</button>
                </div>
            )}
        </div>
    </div>
  )
}

export default Page