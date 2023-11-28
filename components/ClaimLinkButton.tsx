"use client";
import peanut from '@squirrel-labs/peanut-sdk';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getAddress } from './utils/getAddress'

type Props = {
    link:string,
    hashId:string,
}

const ClaimLinkButton = ({link,hashId}:Props) => {
    const smartContractAddress=getAddress();
    const router=useRouter();
    const handleClaim = async () => {
        if(smartContractAddress==="")return;
        const loadingId=toast.loading("Claiming funds, please wait...");
        try{
            const response = await peanut.claimLinkGasless({
                link: link!,
                recipientAddress: smartContractAddress!,
                APIKey: process.env.NEXT_PUBLIC_PEANUT_KEY!,
            })
          
          const res=await fetch(`/api/transactions?hashId=${hashId}`,{
            method:'PUT',
            body:JSON.stringify({receiverAddress:smartContractAddress,status:"Claimed"}),
          })
    
          const data=await res.json();
          console.log("data added to db:",data);
    
          toast.success("Claimed successfully",{
            id:loadingId,
          })
          router.push(`/history`);
        }catch(err){
            console.log(err);
            toast.error("Claiming failed",{
                id:loadingId
            })
        }
    console.log("scw from claim link:",smartContractAddress);
    }
  return (
    <div onClick={handleClaim} className="gradient_pink-orange cursor-pointer text-white-800 rounded-lg whitespace-nowrap p-4 sm:heading4 xs:body-text">
                            Claim Link
                        </div>
  )
}

export default ClaimLinkButton