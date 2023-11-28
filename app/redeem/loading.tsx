import { ArrowRightCircleIcon } from "@heroicons/react/24/outline"


const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;


const loading = () => {
  return (
    <div className="h-[85vh] w-screen flex-center">
        <div className={`h-[85vh] w-screen md:w-[60vw] bg-black-400 rounded shadow-md flex-center flex-col gap-y-3 ${shimmer}`}>
            <div className='text-white-400 heading2 md:heading1 flex-center'>Paste the link here</div>
            <div className='outline-none p-4 rounded shadow-md border-blue-300 w-[70%]' />
            {/* <button type="submit" > */}
            <ArrowRightCircleIcon className="h-8 w-8 text-white-800" />
            {/* </button> */}
        </div>
    </div>
  )
}

export default loading