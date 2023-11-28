import { offRampFunction } from '@/components/utils/getConversion'
import Image from 'next/image'
import { getBalance } from '../actions'
import SendUserButton from './SendToUser'
import SendLinkButton from './SendviaLink'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type prevData={
    sentAmount:string,
    receiver_currency:string,
    sender_currency:string,
    exchangeRate:string,
    iat?:number,
  }

const Form = async ({sender_currency,receiver_currency,sentAmount,exchangeRate}: prevData) => {
    const exRateForbaseCurrency=await offRampFunction(sender_currency);
    const amountInUSDC=Number(sentAmount)/exRateForbaseCurrency?.amount;
    const walletBalance=await getBalance();

    const handleSubmit=async (formData:FormData) => {
        "use server";
        console.log("formData final, ",formData);
        // delay
        const prevDataObj:prevData={
            receiver_currency,
            sender_currency,
            sentAmount,
            exchangeRate
        }
        const finalBodyObj={...prevDataObj,...Object.fromEntries(formData)};
        console.log('final obj:',finalBodyObj)
        const token=jwt.sign(finalBodyObj,process.env.TOKEN_SECRET!);
        console.log('token after submitting',token);
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
        redirect('/send');
    }

  return (
    <form action={handleSubmit} className="h-[70vh] w-full  md:w-3/4 lg:w-1/2 flex flex-col bg-black-400 rounded-md px-4 justify-around">
        <p className="flex-center text-white-500 heading4 md:heading3">Send To:</p>
        <p className="flex-center text-white-400 md:heading4 body-text">You are sending USDC worth {amountInUSDC.toFixed(2)} {sender_currency}</p>
        
        {/* input address */}
        <div className="flex-center gap-x-1 md:gap-x-3  gap-y-3 w-full">
            <input name='receiverAddress' type="text" className="outline-none flex flex-1 items-center text-gray-500 bg-white-800 rounded-md p-4 md:text-2xl body-text shadow-md shadow-white" placeholder="Enter the receiver's address" />
        </div>

        {/* add note */}
        <div className="flex-center gap-x-1 md:gap-x-3 gap-y-3">
            <input name='note' type="text" className="outline-none flex flex-1 items-center text-gray-500 bg-white-800 rounded-md p-4 md:text-2xl body-text shadow-md shadow-white" placeholder="Add a note" />
        </div>
        

        <div className='flex items-center justify-evenly'>
            {/* send to user button */}
            <SendUserButton />

            {/* send via link */}
            <SendLinkButton />
        </div>

        <div className="body-text md:heading4 flex-center text-gradient_pink-orange">
            Available balance:
            <Image height={16} width={16} src={"/icon-192x192.png"} alt="usdc logo" className="m-2 bg-black-400 md:h-[20px] md:w-[20px]" />
            {(walletBalance/10**6).toFixed(2)}
        </div>
        
    </form>
  )
}

export default Form