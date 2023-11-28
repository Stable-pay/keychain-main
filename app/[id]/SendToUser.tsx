"use client";
import Link from 'next/link';
import { experimental_useFormStatus } from 'react-dom'

type Props = {}

const SendUserButton = (props: Props) => {
    const {pending}=experimental_useFormStatus();
  return (
    <div className={`md:text-2xl heading4 flex-center flex-col md:flex-row hover:cursor-pointer my-5`}>
        {/* <Link href="/send/user"> */}
            <button type='submit' className='gradient_purple-blue text-white rounded-2xl p-4 hover:cursor-pointer' disabled={pending} >{pending?'Please Wait...':'Send To User'}</button>
        {/* </Link> */}
    </div>
  )
}

export default SendUserButton