"use client";

import { getBalance } from "@/app/actions";
import { useWallets } from "@privy-io/react-auth";
import { usePrivySmartAccount } from "@zerodev/privy";
import { ECDSAProvider, getRPCProviderOwner } from "@zerodev/sdk";
import { ethers } from "ethers";
import { redirect, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Hex } from "viem";
import erc20ABI from "@/lib/nft.json";
import SendToUserButton from "./SendToUserButton";


type TxnProps = {
    senderAddress:string,
      receiverAddress:string,
      exchangeRate:number,
      sender_currency:string,
      receiver_currency:string,
      sentAmount:number,
      note:string,
      usdc_transferred:number,
  }

type Props={
    transaction:TxnProps
}
  
const Form = async (props: Props) => {
    const {transaction:transactionDetail}:Props=props;
    // const {}=usePrivySmartAccount();
    const {wallets}=useWallets();
    const router=useRouter();
    
    const handleSubmit=async (formData:FormData) => {
        let sendingFundsId=toast.loading("Sending Funds...");
        try{
            if(!transactionDetail.usdc_transferred){
                toast.error("Inappropriate Data...Please revert back to home");
                redirect("/");
            }
            const walletBalance=await getBalance();
            if(transactionDetail.usdc_transferred>Number(walletBalance)/10**6){
                toast.error("Insufficient Funds...");
        redirect("/");
    }

    const ethAmount=transactionDetail.usdc_transferred.toString();
    const weiValue =ethers.utils.parseEther(ethAmount);

    const usdcAmount=transactionDetail.usdc_transferred.toFixed(6);

    const smallestUnitValue=ethers.utils.parseUnits(usdcAmount, 6);

    // console.log("USDC value:", usdcAmount);

    // console.log("weivalue:",weiValue);
    const embeddedWallet=wallets.find(wallet => wallet.walletClientType==="privy");
    const provider=await embeddedWallet?.getEthereumProvider();

    const ethersProvider=await ECDSAProvider.init({
        projectId:process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || "",
        owner:getRPCProviderOwner(provider),
        opts: {
            paymasterConfig: {
                policy: "TOKEN_PAYMASTER",
                gasToken: "USDC",
            },
        },

    })

    const erc20Interface = new ethers.utils.Interface(erc20ABI);

    const transferData = erc20Interface.encodeFunctionData('transfer', [transactionDetail.receiverAddress,smallestUnitValue]);
    const hexlifiedData=ethers.utils.hexlify(transferData);

    const result = await ethersProvider.sendUserOperation({
        data:hexlifiedData as Hex,
        target:"0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        value:BigInt(0),
    })

    await ethersProvider.waitForUserOperationTransaction(result.hash as Hex);

    const txHash=await ethersProvider.getUserOperationReceipt(result.hash as Hex);
    const bodyObj:TransactionProps={
        senderAddress:transactionDetail.senderAddress,
        receiverAddress:transactionDetail.receiverAddress,
        category:"Send",
        status: txHash.success?"Completed":"Failed",
        hashId:txHash.receipt.transactionHash,
        sender_currency:transactionDetail.sender_currency,
        receiver_currency:transactionDetail.receiver_currency,
        sentAmount:transactionDetail.sentAmount,
        exchangeRate:transactionDetail?.exchangeRate,
        note:transactionDetail.note,
        usdc_transferred:transactionDetail.usdc_transferred,
    }
    
    const response=await fetch('/api/transactions',{
            method:"POST",
            body:JSON.stringify(bodyObj),
        })
        const data=await response.json();
        console.log("data added to db:",data);

        // await addToDb(bodyObj);
        
        toast.success("Successfully Sent!!",{
            id:sendingFundsId,
        })
        router.push(`/payments/${txHash.receipt.transactionHash}`);

    }catch(err:any){
        console.log(err);
        toast.error(`Transaction Failed: ${err.message}`,{
            id:sendingFundsId,
        })
    }
  }

  return (
    <div className="flex-center h-screen w-screen">
            {transactionDetail? (
                <form action={handleSubmit} className="bg-black-400 h-[80vh] self-center w-full md:w-3/4 text-white py-6 flex flex-col justify-around items-center overflow-auto no-scrollbar rounded">
                    <p className="heading2 max-w-full flex text-center">Confirm Send</p>
                    <div className="heading4 flex w-full justify-around md:flex-row ">
                        <p className="flex-center text-white-800 w-1/2">Status:</p>
                        <p className="flex-center text-gradient_pink-orange w-1/2 text-ellipsis">Pending...</p>
                    </div>
                    <div className="flex-center flex-col">
                        <p className="heading4 text-white-400">You send {transactionDetail.usdc_transferred?.toFixed(2)} USDC</p>
                        {/* <input type="number" step={0.01} hidden={true} value={transactionDetail?.usdc_transferred}  />  */}
                    </div>
                    <div className="heading4 flex w-full justify-around">
                        <p className="text-gradient_blue-purple flex w-1/2 pl-8">From (You):</p> 
                        <div className="flex flex-col hover:cursor-pointer w-1/2">
                            <p className="flex-center text-gradient_purple-blue">{transactionDetail.senderAddress.substring(0,3)}...{transactionDetail.senderAddress.substring(transactionDetail.senderAddress.length-3)}</p>
                        </div>
                    </div>
                    <div className="heading4 flex w-full justify-around">
                        <p className="text-gradient_blue-purple flex w-1/2 pl-8">To :</p> 
                        <div className="flex flex-col hover:cursor-pointer w-1/2">
                            <p className="flex-center text-gradient_purple-blue">{transactionDetail?.receiverAddress.substring(0,3)}...{transactionDetail.receiverAddress.substring(transactionDetail.receiverAddress.length-3)}</p>
                        </div>
                        {/* <input hidden={true} name='receiverAddress' value={transactionDetail?.receiverAddress} onChange={() => {}} /> */}
                    </div>
                    {/* <div className="heading4 flex w-full justify-around">
                        <p className="text-gradient_blue-purple flex w-1/2 pl-8">Amount:</p>
                        <div className="flex-center flex-col w-1/2">
                            <p className="flex-center text-gradient_purple-blue">{(transactionDetail.sentAmount).toString()} {transactionDetail.sender_currency}</p>
                            <p className="flex-center text-white-400 body-text ">{transactionDetail.senderAddress===smartContractAddress?'-':'+'}{transactionDetail.usdc_transferred?.toFixed(3)} USDC</p>
                        </div>
                    </div> */}
                    <div className="heading4 flex w-full justify-around flex-row">
                        <p className="text-gradient_blue-purple flex  w-1/2 pl-8">Note:</p> 
                        <p className="flex-center text-gradient_purple-blue  w-1/2 text-center text-ellipsis">{transactionDetail?.note}</p>
                        {/* <input hidden={true} name='note' value={transactionDetail?.note} onChange={() => {}} /> */}
                    </div>

                    <SendToUserButton />
                    
                </form>
            ):(
                null
            )
        }
        </div>
  )
}

export default Form