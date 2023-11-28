// "use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import clipboardCopy from "clipboard-copy";
import Link from "next/link";
import toast from "react-hot-toast";

type Props = {
    link:string,
    amount:string,
}

const SendlinkModal = (props: Props) => {

    const handleCopy=async () => {
        try {
            const copyingToast=toast.loading("Copying to clipboard...");
            await clipboardCopy(props.link);
            toast.success("Successfully copied!",{
                id:copyingToast
            })
        } catch (err) {
            console.error('Failed to copy to clipboard: ', err);
        }
    }

    // const handleClose= async () => {
    //     redirect("/?feature=history");
    // }

  return (
    <>
        <div className={`fixed top-0 left-0 flex-center h-screen w-screen backdrop-blur-md z-50`}>
            <div className='w-full h-1/2 md:w-1/2 bg-white rounded-lg'>  
                <div className="flex items-center justify-around  m-6 heading2">
                    <div className="flex flex-col gap-y-2">
                        <p>Link Created</p>
                        <p className="heading4 text-gray-500">Anyone with this link can claim {props.amount}</p>
                    </div>
                    <Link href="/history"> 
                        <XMarkIcon className="h-12 w-12 hover:cursor-pointer" />
                    </Link>
                </div>  
                <p className="bg-gray-300 m-3 rounded p-5 overflow-auto no-scrollar">{props.link}</p>
                <div className="flex-center">
                    <button className="gradient_pink-orange p-8 heading3 text-white-800 rounded" onClick={handleCopy} >Copy Link</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default SendlinkModal