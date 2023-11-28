// "use client";

import Link from "next/link";
import { getAddress } from "@/app/actions";
import ClaimLinkButton from "./ClaimLinkButton";

type Props = {
    transaction: TransactionProps,
}

// const fetcher = async (id: string) => {
//     const data = await fetch(`/api/transactions?hashId=${id}`).then(response => response.json());
//     return data;
// }

const TransactionDetailsComponent = ({transaction}:Props) => {

    const transactionDetail=transaction;
    const linkExist=transaction?.link!=="" && transaction?.receiverAddress==="";
    const smartContractAddress=getAddress();
    const formattedDate= (date:string) => {
        const utcDateString = date;
        const utcDate = new Date(utcDateString || "");

        // Convert UTC date to local date
        const localDate = new Date(utcDate);

        // To get the local date and time as a string
        const localDateString = localDate.toLocaleString();
        return localDateString;
    }

    // const sharePayment = () => {
    //     const transactionDetails = 'Your transaction details here.';
    //     if (navigator) {
    //       navigator?.share({
    //         title: 'Share Payment',
    //         text: transactionDetails,
    //       })
    //         .then(() => console.log('Shared successfully.'))
    //         .catch((error) => console.error('Sharing failed:', error));
    //     }
    //   };

    return (
    <div className="flex-center h-screen w-screen">
            {transactionDetail? (
                <div className="bg-black-400 h-[80vh] self-center w-full md:w-3/4 text-white py-6 flex flex-col justify-around items-center overflow-auto no-scrollbar rounded">
                    <p className="heading2 max-w-full flex text-center">Transaction Details</p>
                    <div className="heading4 flex w-full justify-around md:flex-row ">
                        <p className="flex-center text-white-800 w-1/2">Status:</p>
                        <p className="flex-center text-gradient_pink-orange w-1/2 text-ellipsis">{transactionDetail.status}</p>
                    </div>
                    <div className="flex-center flex-col">
                        <p className="heading4 text-white-400">{transactionDetail.senderAddress===smartContractAddress?'You sent':'You received'} {transactionDetail.usdc_transferred?.toFixed(3)} USDC</p>
                        <p className="body-text text-white-500">on {formattedDate(transactionDetail.createdAt || "")}</p>
                    </div>
                    <div className="heading4 flex w-full justify-around">
                        <p className="text-gradient_blue-purple flex w-1/2 pl-8">From {transactionDetail.senderAddress===smartContractAddress?'(You)':''}:</p> 
                        <div className="flex flex-col hover:cursor-pointer w-1/2">
                            <p className="flex-center text-gradient_purple-blue">{transactionDetail.senderAddress.substring(0,3)}...{transactionDetail.senderAddress.substring(transactionDetail.senderAddress.length-3)}</p>
                        </div>
                    </div>
                    <div className="heading4 flex w-full justify-around">
                        <p className="text-gradient_blue-purple flex w-1/2 pl-8">To {transactionDetail.receiverAddress===smartContractAddress?'(You)':''}:</p> 
                        <div className="flex flex-col hover:cursor-pointer w-1/2">
                            <p className="flex-center text-gradient_purple-blue">{transactionDetail.receiverAddress.substring(0,3)}...{transactionDetail.receiverAddress.substring(transactionDetail.receiverAddress.length-3)}</p>
                        </div>
                    </div>
                    <div className="heading4 flex w-full justify-around">
                        <p className="text-gradient_blue-purple flex w-1/2 pl-8">Amount:</p>
                        <div className="flex-center flex-col w-1/2">
                            <p className="flex-center text-gradient_purple-blue">{(transactionDetail.sentAmount).toString()} {transactionDetail.sender_currency}</p>
                            <p className="flex-center text-white-400 body-text ">{transactionDetail.senderAddress===smartContractAddress?'-':'+'}{transactionDetail.usdc_transferred?.toFixed(3)} USDC</p>
                        </div>
                    </div>
                    <div className="heading4 flex w-full justify-around lex-row">
                        <p className="text-gradient_blue-purple flex  w-1/2 pl-8">Note:</p> 
                        <p className="flex-center text-gradient_purple-blue  w-1/2 text-center text-ellipsis">{transactionDetail?.note}</p>
                    </div>
                    
                    {linkExist && (
                        <div className="flex flex-col justify-center w-full items-center gap-y-10">
                            <div className="text-gradient_blue-purple heading4 py-2 w-full flex justify-around">
                                <p className="text-gradient_blue-purple flex  w-1/2 pl-8">Category:</p> 
                                <p className="flex-center text-gradient_purple-blue  w-1/2">{transactionDetail.senderAddress===smartContractAddress?'Outgoing':'Incoming'} via link</p>
                            </div>
                        </div>

                    )}
                    <div className="flex items-center justify-around gap-x-2">
                        {linkExist && <ClaimLinkButton hashId={transactionDetail.hashId} link={transactionDetail.link!} />}
                        <div className="gradient_pink-orange cursor-pointer text-white-800 rounded-lg whitespace-nowrap p-4 sm:heading4 xs:body-text">
                            <Link href={`https://polygonscan.com/tx/${transactionDetail.hashId}`} target="_blank">View on PolygonScan</Link>
                        </div>
                    </div>
                </div>
            ):(
                null
            )
        }
        </div>
    );
}

export default TransactionDetailsComponent;
