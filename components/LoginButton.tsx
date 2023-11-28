"use client";

import { create } from "@/app/actions";
import { usePrivySmartAccount } from "@zerodev/privy";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginButton = () => {
    const {login,zeroDevReady,user}=usePrivySmartAccount();
    const router=useRouter();
    useEffect(() => {
      if(!zeroDevReady)return ;
      const handleLogin=async () => {
            try{
              const response=await fetch("/api/login",{
                body:JSON.stringify({
                    address:user.wallet?.address,
                }),
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                  },
            });
            const token=await response.json();
            if(token.success)localStorage.setItem('token',token.token);
          }catch(err:any){
            console.log(err.message);
          }
      }
      handleLogin().then(() => router.push("/"));
  },[zeroDevReady]);
  return (
    <button onClick={login} className="rounded gradient_pink-orange p-4 px-6 text-white-800 shadow-md">Login</button>
  )
}

export default LoginButton