"use client";
import Link from 'next/link';
import { experimental_useFormStatus } from 'react-dom'

type Props = {}

const SendLinkButton = (props: Props) => {
    const {pending,action,data}=experimental_useFormStatus(); 

    console.log("action:",action);
    console.log("data from sendvia link:",data);

  return (
    <div className={`md:text-2xl heading4 flex-center flex-col md:flex-row hover:cursor-pointer my-5`}>
        {/* <Link href="/send/link" > */}
            <button type='submit' className='gradient_purple-blue text-white rounded-2xl p-4 hover:cursor-pointer' disabled={pending} >{pending?'Please Wait': 'Send via link'}</button>
        {/* </Link> */}
    </div>
  )
}

export default SendLinkButton