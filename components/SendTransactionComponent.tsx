"use client";

import { ArrowLeftCircleIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePrivySmartAccount } from "@zerodev/privy";
import { ethers } from "ethers";
import {ValidChecker} from "@/components/utils/ethereum_validator";

import dynamic from "next/dynamic";
import LoadingComponent from "./LoadingComponent";
import getConversionAmount, { offRampFunction } from "./utils/getConversion";
import peanut from "@squirrel-labs/peanut-sdk";
import { useSearchParams,useRouter } from "next/navigation";
import SendlinkModal from "./SendlinkModal";
import Image from "next/image";
import Link from "next/link";
// import SetCurrency from "./SetCurrency";
import { addToDb, getBalance } from "@/app/actions";
import erc20ABI from "../lib/nft.json";
import { useWallets } from "@privy-io/react-auth";
import { Hex } from "viem";
import {ECDSAProvider, getRPCProviderOwner} from "@zerodev/sdk";
import { useCurrencyStore } from "@/store/CurrencyStore";
import ExchangeRate from "./ExchangeRateButton";
import AddFundsButton from "./AddFundsButton";

const WalletComponent=dynamic(() => 
    import("./WalletComponent")
,{
    loading: () => <LoadingComponent />
} )

function convertToSubstring(input:string){
    return input.substring(0,3)+'...'+input.substring(input.length-3,);
}

const SendTransactionComponent = () => {
    const searchParams=useSearchParams();
    const [value, setValue] = useState<string>('');
    const [receiverAmount,setReceiverAmount]=useState("0.00");
    const [receiverAddress,setReceiverAddress]=useState<string>(searchParams.get('to') || "");
    const [receiverCurrency,setReceiverCurrency]=useState<string>("INR");
    const [baseCurrency]=useCurrencyStore(state => [state.baseCurrency]);
    // const [dropDownOpen,setDropDownOpen]=useState<boolean>(false);
    const [loading,setLoading]=useState(false);
    const {user,getEthereumProvider,zeroDevReady}=usePrivySmartAccount();
    const [exRate,setExRate]=useState<Number>(0.0);
    const [validatorOpen,setValidatorOpen]=useState(false);
    const [noteAdded,setNoteAdded]=useState("");
    const [link,setLink]=useState('');
    const [walletBalance,setWalletBalance]=useState("0.00");
    const [invalidInput,setInvalidInput]=useState(0.00);
    const {wallets}=useWallets();
    const router=useRouter();

    // console.log("sendtransaction component loading,...");

    useEffect(() => {

        
        const getTestbalance=async () => {
            // const userChainId=user.wallet;
            // console.log("User wallet:",userChainId);
            let walletBalance=await getBalance();
            walletBalance=Number(walletBalance)/10**6;
            setWalletBalance(walletBalance.toFixed(2));
        };

        // Set up an interval to call getData every 5 seconds
        const intervalId = setInterval(getTestbalance, 1000*5);
        // console.log("test balance fetched");

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    },[zeroDevReady]);

    // useEffect(() => {
    //     const fetcher= async () => {
    //         setLoading(true);
    //         const rate=await getConversionAmount(baseCurrency,receiverCurrency,1);
    //         let val=Number(rate.toFixed(2));
    //         if(isNaN(val))val=0;
    //         setExRate(val);
    //         setLoading(false);
    //     }
    //     fetcher();
    //     // setDropDownOpen(!dropDownOpen);
    // },[receiverCurrency]);

    useEffect(() => {
        const maxAllowedInput=async () => {
            const rate:any=await offRampFunction(baseCurrency); //1 usdc in baseCurrency
            setInvalidInput(Number(walletBalance)*rate?.amount);
        }
        maxAllowedInput();
    },[baseCurrency,walletBalance]);

    const handleReceiverAdress=async (e:ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setReceiverAddress(inputValue);
        // console.log(`receiver Address: ${receiverAddress}`);
        // console.log(`Valid Address: ${ValidChecker.isValidAddress(receiverAddress)}`);
      };

    // This function ensures that the input only contains numbers
    const handleInputChange =async  (e:ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if(Number(inputValue)<0)return ;
        // Use a regular expression to allow only numbers (0-9)
        // const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
        setValue(inputValue);
        // const recevingAmount=exRate*Number(inputValue);
        // const amount_without_commas=Number(recevingAmount.toFixed(2));
        // const formattedAmount=amount_without_commas.toLocaleString();
        // console.log(`receevingamount: ${recevingAmount} without commas ${amount_without_commas} formatted: ${formattedAmount}`)
        // setReceiverAmount(formattedAmount);
    };

    const handleValidator=() => {
        // if(receiverAddress==="")return ;
        if(!user?.wallet)return ;
        if(Number(receiverAmount)>0)
            setValidatorOpen(true);
    }

    // useEffect(() => {
    //     const recevingAmount=exRate*Number(value);
    //     const amount_without_commas=Number(recevingAmount.toFixed(2));
    //     const formattedAmount=amount_without_commas.toLocaleString();
    //     // console.log(`receevingamount: ${recevingAmount} without commas ${amount_without_commas} formatted: ${formattedAmount}`)
    //     setReceiverAmount(formattedAmount);
    // },[exRate,value]);

    // const handleDropDown=() => {
    //     // setCase(input);
    //     setDropDownOpen(!dropDownOpen);
    // }

    // useEffect(() => {
    //     const ethAmount=value.toString();
    //     const weiValue =ethers.utils.parseEther(ethAmount);
    //     const hexValue= ethers.utils.hexlify(weiValue);

    //     const usdcDecimals = 6; // USDC has 6 decimal places
    //     const ethDecimals =18;
    //     // const usdcValue = ethers.utils.formatUnits(weiValue,usdcDecimals);
    //     const usdcValue=weiValue.div(BigInt(10**(ethDecimals-usdcDecimals)));

    //     console.log("USDC value:", usdcValue);
    // },[value]);
    
    const handleSubmit=async () => {
        // e.preventDefault();

        if(receiverAddress==="")return ;
        if(!user.wallet)return ;
        
        const sendingFundsId=toast.loading("Sending Funds...");
        let walletBalance=await getBalance();
        walletBalance=Number(walletBalance)/10**6;
        const rate:any=await offRampFunction(baseCurrency); //1 usdc in baseCurrency
        const amount=Number(value)/rate?.amount;
        
        if(amount > walletBalance){
            toast.error("Insufficient funds...",{
                id:sendingFundsId,
            })    
            return ;
        }

        try{
            setLoading(true);

            const ethAmount=amount.toString();
            const weiValue =ethers.utils.parseEther(ethAmount);
            const hexValue= ethers.utils.hexlify(weiValue);

            const usdcDecimals = 6; // USDC has 6 decimal places
            const ethDecimals =18;
            // const usdcValue = ethers.utils.formatUnits(weiValue,usdcDecimals);
            const usdcAmount=amount.toFixed(6);

            const smallestUnitValue=ethers.utils.parseUnits(usdcAmount, 6);

            console.log("USDC value:", usdcAmount);

            console.log("weivalue:",weiValue);
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

            const transferData = erc20Interface.encodeFunctionData('transfer', [receiverAddress,smallestUnitValue]);
            const hexlifiedData=ethers.utils.hexlify(transferData);

            const result = await ethersProvider.sendUserOperation({
                data:hexlifiedData as Hex,
                target:"0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
                value:BigInt(0),
            })

            await ethersProvider.waitForUserOperationTransaction(result.hash as Hex);

            const txHash=await ethersProvider.getUserOperationReceipt(result.hash as Hex);

            console.log("result:",result);
            console.log("tx Hash:",txHash);

            // const provider=new ethers.providers.Web3Provider(getEthereumProvider());
            // const USDC_Address="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
            // const USDC = new ethers.Contract(USDC_Address, erc20ABI,provider);

            // await USDC.connect(provider.getSigner(user?.wallet?.address)).

            // const setup=async () => {
                // 1. Create a Viem Wallet Client using the custom transport
                // const client = createWalletClient({
                //     chain: polygon,
                //     transport: custom(window.ethereum),
                // });
                // const projectId=process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || "";
                // const owner=convertWalletClientToAccountSigner(client);
                // // 2. Create a ZeroDev ECDSAProvider passing the Viem Wallet Client as the signer
                // let ecdsaProvider = await ECDSAProvider.init({
                //     projectId, // zeroDev projectId
                //     owner,
                //     opts: {
                //         paymasterConfig: {
                //           policy: "TOKEN_PAYMASTER",
                //           gasToken: "USDC",
                //         },
                //         providerConfig: {
                //           opts: {
                //             txMaxRetries: 1,
                //           },
                //         },
                //       },
                // });
                // await ecdsaProvider.getAccount().getInitCode();

                // const transferData = encodeFunctionData({
                //     abi: erc20ABI,
                //     args: [receiverAddress, BigInt(133700000000)],
                //     functionName: "transfer",
                //   });

                // const {hash} =await ecdsaProvider.sendUserOperation({
                //     target:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                //     data:transferData,
                //     value:BigInt(0),
                // })

                // console.log("hash :", hash);
                // toast.success("sent success",{
                //     id:sendingFundsId,
                // })
            // }

            // const privateKey=generatePrivateKey();
            // const owner=LocalAccountSigner.privateKeyToAccountSigner(privateKey);

            /*

                const arr=[
                    {"usdc":"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"},
                    {""}.////
                ]

            */
            
            // const unsignedTx={
            //     to: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", //arr[token]
            //     chainId:137,
            //     // value:hexValue,
            //     data:erc20Interface.encodeFunctionData("transfer", [receiverAddress, weiValue.toString()])
            // }
            // const hashId=await sendTransaction(unsignedTx); 

            // console.log("hash generated:",hashId);

            const bodyObj:TransactionProps={
                senderAddress:user.wallet?.address || "",
                receiverAddress:receiverAddress,
                category:"Send",
                status: txHash.success?"Completed":"Failed",
                hashId:txHash.receipt.transactionHash,
                sender_currency:baseCurrency,
                receiver_currency:receiverCurrency,
                sentAmount:Number(value),
                exchangeRate:Number(exRate),
                note:noteAdded,
                usdc_transferred:amount,
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
                setLoading(false);
            router.push(`/payments/${txHash.receipt.transactionHash}`);

        }catch(err){
            toast.error("Transaction Failed",{
                id:sendingFundsId,
            })
            console.log(err);
        }

    }   


    const handleLinkTransfer = async () => {
        if(zeroDevReady){


            const smartContractAddress = user?.wallet?.address;
            if(!smartContractAddress)return ;
            
            const loadingLink=toast.loading("Creating Link...");
            try{
                let testWalletBalance=await getBalance();
                testWalletBalance=Number(testWalletBalance)/10**6;
                const rate:any=await offRampFunction(baseCurrency); //1 usdc in baseCurrency
                const amount=Number(value)/rate?.amount;
                
                if(amount > testWalletBalance){
                    toast.error("Insufficient funds...");    
                    return ;
                }

                const scwProvider=await getEthereumProvider();
                // await scwProvider.request({method:""})
                const scwEthProvider=new ethers.providers.Web3Provider(scwProvider);
                // const scwSigner=await scwEthProvider.getSigner(user?.wallet?.address);
                const scwSigner=await scwEthProvider.getSigner(user?.wallet?.address);

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

                // const signer=await ethersProvider.sin



                const chainId=user?.wallet?.chainId;

                // console.log(`chainId: ${chainId} signer ${scwSigner}`);
                // console.log(scwSigner);
                // await peanut.toggleVerbose();


                // const createLinkResponse = await peanut.createLink({
                //     structSigner: {
                //         signer: scwSigner,
                //     },
                //     linkDetails: {
                //         chainId: 137,
                //         tokenAmount: amount,
                //         tokenType: 1,
                //         tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
                //         tokenDecimals:6
                //     },
                // });


                const passwords=await peanut.getRandomString(16);

                const prepareTxn=await peanut.prepareTxs({
                    address:smartContractAddress,
                    linkDetails: {
                        chainId: 137,
                        tokenAmount: amount,
                        tokenType: 1,
                        tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
                        tokenDecimals:6
                    },
                    // provider:scwSigner,
                    passwords:[passwords],
                })

                console.log("prepareTxn: ",prepareTxn);

                const unsignedTx1=prepareTxn.unsignedTxs[0];

                const result1 = await ethersProvider.sendUserOperation({
                    data:unsignedTx1.data as Hex,
                    target:unsignedTx1.to as Hex,
                    value:BigInt(0),
                })

                await ethersProvider.waitForUserOperationTransaction(result1.hash as Hex);
                const txHash1=await ethersProvider.getUserOperationReceipt(result1.hash as Hex);

                console.log("txHash for 1st txn:",txHash1);

                const unsignedTx2=prepareTxn.unsignedTxs[1];

                const result2 = await ethersProvider.sendUserOperation({
                    data:unsignedTx2.data as Hex,
                    target:unsignedTx2.to as Hex,
                    value:BigInt(0),
                })

                await ethersProvider.waitForUserOperationTransaction(result2.hash as Hex);
                const txHash2=await ethersProvider.getUserOperationReceipt(result2.hash as Hex);

                console.log("txHash for 2nd txn:",txHash2);

                const shareableLink=await peanut.getLinksFromTx({
                    linkDetails:{
                        chainId: 137,
                        tokenAmount: amount,
                        tokenType: 1,
                        tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
                        tokenDecimals:6
                    },
                    passwords:[passwords],
                    txHash:txHash2.receipt.transactionHash,
                });

                console.log("shareable link:",shareableLink);



                // console.log("response:", createLinkResponse);
                // console.log("link:", createLinkResponse.link);
                // // setLink(createLinkResponse.createdLink.link[0]);
                let hashId=txHash2.receipt.transactionHash;

                if(!hashId){
                    toast.error("Link Creation Unsuccessful", {
                        id: loadingLink,
                    });
                    return ;
                }

                    const bodyObj:TransactionProps={
                        senderAddress:user.wallet?.address || "",
                        receiverAddress:"",
                        category:"SendviaLink",
                        status:"Pending",
                        hashId:hashId,
                        sender_currency:baseCurrency,
                        receiver_currency:receiverCurrency,
                        sentAmount:Number(value),
                        exchangeRate:Number(exRate),
                        note:noteAdded,
                        usdc_transferred:amount,
                        link:shareableLink.links[0],
                    }
                    
                    const response=await fetch('/api/transactions',{
                        method:"POST",
                        body:JSON.stringify(bodyObj),
                    })
                    const data:TransactionProps=await response.json();
                    console.log("data added to db:",data);

                    // await addToDb(bodyObj);

                    // if (data.error) {
                    //     // Handle the case where there is an error in the response, e.g., validation error
                    //     toast.error(data.error, {
                    //         id: loadingLink,
                    //     });
                    // } else {
                        // Handle success
                        toast.success("Link Created", {
                            id: loadingLink,
                        });
                    // }

                    // const uriLink=hashId;

                    setLink(`https://stable-pay-mukul202.vercel.app/redeem?hash=${hashId}`);
                    setLoading(false);
                    

                    // router.push(`/payments/${hashId}`);
                    

            }catch(err){
                console.log(err);
                toast.error("Link Creation Unsuccessful", {
                    id: loadingLink,
                });
            }

        }
    }

  return (
    <div className="flex-center w-screen">
        {/* {dropDownOpen? (<SetCurrency />):( */}
        {/* {baseCurrency==="" && <SetCurrency isOpen={false} onSelect={(option) => setBaseCurrencyCookie(option)} />} */}
            <div className={`${validatorOpen?'hidden':''} h-[70vh] w-full md:w-3/4 lg:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around gap-y-1`}>
                <WalletComponent baseCurrency={baseCurrency} />
                {/* <div className="flex-center gap-x-3 gap-y-3 flex-col md:flex-row">
                    <p className=" text-gradient_blue-purple text-3xl font-bold">Send to:</p>
                    <input required={true} onChange={handleReceiverAdress} type="text" value={receiverAddress} className="outline-none flex flex-1 items-center text-gray-500 bg-white-800 rounded-md p-4 text-2xl shadow-md shadow-white max-w-full" placeholder="Enter the receiver's contract address" />
                </div> */}
                <div className="flex-center gap-x-4 w-full">
                    <div className="flex flex-col justify-center gap-y-1 w-1/2 pl-8">
                        <p className="text-white-400 md:heading4 body-text">You Send:</p>
                        <p className="text-gradient_blue-purple md:heading2 heading3">{baseCurrency}</p>
                    </div>
                    <input style={{appearance:'none',outline:'none'}} inputMode='decimal' type="number" onChange={handleInputChange} value={value} required className={`outline-none ${Number(value)>invalidInput?'border-[#DC143C]':'border-[#2ecc71]'} border-[6px] no-scrollar w-1/2 flex-center text-gray-500 bg-white-800 rounded-md p-4 md:text-2xl body-text max-w-full`} placeholder="Enter Amount" />
                </div>
                <div className="flex flex-col justify-center gap-y-1 w-1/2 pl-[56px]">
                    <ArrowsUpDownIcon className="h-7 w-7 text-white-500 hover:cursor-pointer" />
                    <div className="w-1/2"></div>
                </div>
                {/* <div className="flex heading4 w-full">
                    <p className="text-white-400 w-1/2 pl-12">Receiver Gets:</p>
                    {loading ? <LoadingComponent />:<p className="text-white-500 text-center">1 {baseCurrency} = {exRate} {receiverCurrency}</p>}
                </div> */}
                {/* <div className="flex-center w-full">
                    <div className="w-1/2 flex flex-col gap-y-1">
                        <p className=" text-white-400 md:heading4 body-text pl-8">Receiver Gets:</p>
                        <div className="flex w-full items-center">
                            <p className=" text-gradient_blue-purple md:heading2 heading3 pl-8">{receiverCurrency}</p>
                            <ArrowDownIcon className="h-7 w-7 text-white pl-2 hover:cursor-pointer" onClick={handleDropDown} />
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col gap-y-1">
                        {loading ? <LoadingComponent />:<p className="text-white-500 md:heading4 body-text">1 {baseCurrency} = {exRate} {receiverCurrency}</p>}
                        <p className=" text-gradient_purple-blue md:heading2 heading3 flex items-center w-full overflow-auto">{receiverAmount}</p>
                    </div>
                </div> */}

                <ExchangeRate value={value} baseCurrency={baseCurrency} setReceiverAmount={(option) => setReceiverAmount(option)} setReceiverCurrency={(option) => setReceiverCurrency(option)} setExRate={(option) => setExRate(option)}/>

                <div className="heading4 md:text-2xl gap-x-3 flex items-center justify-around hover:cursor-pointer">
                    {/* <Link href={`https://onramp.money/main/buy/?appId=625451&walletAddress=${user?.wallet?.address}`}>
                    <button className='gradient_purple-blue text-white rounded-2xl p-4 hover:cursor-pointer'>Add funds</button>
                    </Link> */}
                    <AddFundsButton />
                    <button className={`text-white rounded-2xl p-4 hover:cursor-pointer ${loading?'bg-gray-500':'gradient_purple-blue'}`} disabled={loading} onClick={handleValidator}>{loading?'Please Wait...':'Send Funds'}</button>
                </div>
            </div>
        {/* )} */}
        {/* {dropDownOpen && <SetCurrency isOpen={dropDownOpen} onSelect={(option) => setReceiverCurrency(option)} toggleDropdown={handleDropDown} />} */}
        {validatorOpen && (
            <div className="h-[70vh] md:h-[60vh] w-full relative  md:w-3/4 lg:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around">
            <div className="top-0 left-0 h-10 w-10 absolute m-3">
                <ArrowLeftCircleIcon className=" hover:cursor-pointer rounded-full text-white-800" onClick={() => setValidatorOpen(false)} />
            </div>
            <p className="flex-center text-white-500 heading4 md:heading3">Send To:</p>
            <p className="flex-center text-white-400 md:heading4 body-text">You are sending {searchParams.has('to')?convertToSubstring(searchParams.get('to')!):''} USDC worth {value} {baseCurrency}</p>
            {searchParams.has('to')?<></>:(<div className="flex-center gap-x-1 md:gap-x-3  gap-y-3 w-full">
                <input onChange={handleReceiverAdress} type="text" value={receiverAddress} className="outline-none flex flex-1 items-center text-gray-500 bg-white-800 rounded-md p-4 md:text-2xl body-text shadow-md shadow-white" placeholder="Enter the receiver's address" />
            </div>)}
            <div className="flex-center gap-x-1 md:gap-x-3 gap-y-3">
                {/* <p className=" text-gradient_blue-purple md:text-2xl heading4 font-bold">Add Note:</p> */}
                <input onChange={(e) => setNoteAdded(e.target.value)} type="text" value={noteAdded} className="outline-none flex flex-1 items-center text-gray-500 bg-white-800 rounded-md p-4 md:text-2xl body-text shadow-md shadow-white" placeholder="Add a note" />
            </div>

            <div className="flex items-center justify-around">
            {(receiverAddress==="" || !ValidChecker.isValidAddress(receiverAddress)) ? (<div className="flex-center p-4 gap-x-3 gap-y-3 flex-col md:flex-row">
                <p className="text-gradient_pink-orange body-text md:heading4 font-bold">Please Enter Valid Address</p>
            </div>):
            (
                <div className={`${receiverAddress==""?'hidden':''} md:text-2xl heading4 flex-center flex-col md:flex-row hover:cursor-pointer my-5`}>
                    <button className='gradient_purple-blue text-white rounded-2xl p-4 hover:cursor-pointer' disabled={loading} onClick={handleSubmit}>Send to User</button>
                </div>
            )
            }
            
            <div className="md:text-2xl heading4 flex-center hover:cursor-pointer">
                <button className='gradient_pink-orange text-white rounded-2xl p-4 hover:cursor-pointer' disabled={loading} onClick={handleLinkTransfer}>Send via Link</button>
            </div>

            </div>
            <div className="body-text md:heading4 flex-center text-gradient_pink-orange">
                Available balance:
                <Image height={16} width={16} src={"/icon-192x192.png"} alt="usdc logo" className="m-2 bg-black-400 md:h-[20px] md:w-[20px]" />
                {walletBalance}
            </div>

            {(link!=="" && !loading) && (
                <SendlinkModal link={link} amount={value+''+baseCurrency} />
            )}
        </div>
        )}
    </div>
  )
}

export default SendTransactionComponent