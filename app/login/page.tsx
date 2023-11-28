import LoginButton from "@/components/LoginButton"
import { Suspense } from "react"

const LoginButtonSkeleton=() => {
    return (
        <button className="rounded gradient_pink-orange p-4 px-6 text-white-800 shadow-md">Login</button>
    )
}

const LoginPage = async () => {
  return (
    <div className="flex-center h-screen w-screen flex-col">
        <div className="text-white-400 w-full flex-center font-bold my-10 heading2">
            <p><b className="text-gradient_pink-orange">Please login</b> to access the world of future<b className="text-gradient_blue-purple"> digital payments.</b></p>
        </div>
        <Suspense fallback={<LoginButtonSkeleton />}>
            <LoginButton />
        </Suspense>
    </div>
  )
}

export default LoginPage