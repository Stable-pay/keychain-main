import { ArrowDownIcon, PlusCircleIcon, UserCircleIcon, WalletIcon } from '@heroicons/react/24/outline'

function LoadingScreen() {
  return (
    <div className='flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500'>
        <div className='flex h-[85vh] w-full flex-col items-center self-center md:w-1/2 rounded-md shadow-lg bg-black-300 py-4 overflow-auto no-scrollbar'>
            <p className='font-bold text-2xl text-gradient_pink-orange'>Account</p>
            <div className='flex mt-4 justify-center items-center text-gray-500'>
                <WalletIcon className='h-12 w-12' />
                <p>Wallets</p>
            </div>
            <p className='text-gray-400'>Connect and link Wallets to your account</p>
            <div className='border border-blue-400 rounded-md flex justify-between p-2 items-center w-4/5 m-4'>
                <p className='text-gray-400'></p>
                <span className='text-gray-400 p-2 rounded-md hover:cursor-pointer'>Copy</span>
            </div>
            <div className='w-full flex flex-col my-2'>
                <div className='text-gray-600 flex justify-center items-center'>
                    <UserCircleIcon className='h-8 w-8' />
                    <p className='text-gray-400'>Linked Socials</p>
                </div>
                
                <div className='border flex justify-between items-center w-full md:w-3/4 self-center rounded-md p-2 my-1 mx-2'>
                    <p className='text-gray-300'>Email</p>
                    {/* <PlusCircleIcon 
                    className={`h-8 w-8 gradient_pink-orange rounded-full text-white hover:cursor-pointer`} 
                     /> */}
                    <p className={`text-gray-400`}>Not Linked</p>
                </div>
                <div className='border flex justify-between items-center w-full md:w-3/4 self-center rounded-md p-2 my-1 mx-2'>
                    <p className='text-gray-300'>Phone</p>
                    {/* <PlusCircleIcon 
                    className={`h-8 w-8 gradient_pink-orange rounded-full text-white hover:cursor-pointer`} 
                     /> */}
                    <p className={`text-gray-400`}>Not Linked</p>
                </div>
                <div className='border flex justify-between items-center w-full md:w-3/4 self-center rounded-md p-2 my-1 mx-2'>
                    <p className='text-gray-300'>Google</p>
                    {/* <PlusCircleIcon 
                    className={`h-8 w-8 gradient_pink-orange rounded-full text-white hover:cursor-pointer`} 
                     /> */}
                    <p className={`text-gray-400`}>Not Linked</p>
                </div>
                <div className='border flex justify-between items-center w-full md:w-3/4 self-center rounded-md p-2 my-1 mx-2'>
                    <p className='text-gray-300'>Discord</p>
                    {/* <PlusCircleIcon 
                    className={`h-8 w-8 gradient_pink-orange rounded-full text-white hover:cursor-pointer`} 
                     /> */}
                    <p className={`text-gray-400`}>Not Linked</p>
                </div>
                <div className='border flex justify-between items-center w-full md:w-3/4 self-center rounded-md p-2 my-1 mx-2'>
                    <p className='text-gray-300'>Twitter</p>
                    {/* <PlusCircleIcon 
                    className={`h-8 w-8 gradient_pink-orange rounded-full text-white hover:cursor-pointer`} 
                     /> */}
                    <p className={`text-gray-400`}>Not Linked</p>
                </div>
            </div>
            
            <div className="flex w-full items-center justify-between p-4">
                <div className='body-text md:heading4 text-gray-500 flex-center flex-1'>
                    Default Base Currency
                </div>
                <div className='flex items-center'>
                <p className=" text-gradient_blue-purple md:heading2 heading3 pl-8">USD</p>
                <ArrowDownIcon className="h-7 w-7 text-white pl-2 hover:cursor-pointer" />
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default LoadingScreen