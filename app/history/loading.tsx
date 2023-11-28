

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

const loading = () => {
  return (
    <div className="w-screen flex-center">
        <div className="md:max-h-[85vh] max-h-[90vh] w-full md:w-3/4 self-center bg-black-400 py-3 flex flex-col overflow-auto shadow shadow-white-400 rounded no-scrollbar">
        <div className="bg-black-300">
            <p className="md:heading1 heading2 text-white-800 flex-center w-full py-6 text-center"></p>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
                <div className={`py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded ${shimmer}`}></div>
            </div>
        </div>
    </div>
  )
}

export default loading