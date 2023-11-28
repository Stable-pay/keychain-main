"use server";
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken";
import { isAuthenticated } from '@/lib/auth';

export const create=async (data:string) => {
    const cookieStore=cookies();
    if(cookieStore.has('token') && cookieStore.get('token')?.value!==""){
        return ;
    }
    // if(data!==""){
    //     // console.log("data from create:",data);
    //     cookieStore.delete("token");
    //     cookieStore.set("smartContractAddress",data);
    // }
}

export const getAddress=() => {
    const cookieStore=cookies();
    if(cookieStore.has("token")){
        const smartContractAddress:any=jwt.verify(cookieStore.get('token')?.value!,process.env.TOKEN_SECRET!);
        return smartContractAddress.address;
    }
    return "";
}

export const getBalance=async () => {
    if(!isAuthenticated())return "0.0";
    console.log("balance fetched server side");
    const smartContractAddress=getAddress();
    console.log('scw:',smartContractAddress);
    const uri = `https://api.polygonscan.com/api?module=account&tag=latest&action=tokenbalance&contractaddress=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&address=${smartContractAddress}&apikey=${process.env.NEXT_PUBLIC_POLYGON_API}`;
    const response=await fetch(uri,{
        next:{
            tags:['walletBalance'],
            revalidate:500,
        }
    });
    const data=await response.json();
    console.log('wallet balance using erc20 ',data);
    return data.result;
}

export const setBaseCurrencyCookie=async (currency:string) => {
    const cookieStore=cookies();
    if(!cookieStore.has('baseCurreny')){
        cookieStore.set('baseCurrency',currency);
    }
}

export const getBaseCurrency=() =>{
    const cookieStore=cookies();
    // if(!cookieStore.has('baseCurrency')){
    //     cookieStore.set('baseCurrency','USD');
    // }
    return cookieStore.get('baseCurrency')?.value || "USD";
}

export const sendTransaction=async (formData:FormData) => {
    const cookieStore=cookies();
    if(cookieStore.has('smartContractAddress')){
        // console.log(`prev:`,prev);
        console.log(`formdata: `,formData);
    }
}

export const DeleteCookies=async () =>{
    const cookieStore=cookies();
    cookieStore.getAll().map(cookie => (
        cookieStore.delete(cookie.name)
    ))
}

export const addToDb=async (bodyObj:TransactionProps) => {
    const response=await fetch('/api/transactions',{
        method:"POST",
        body:JSON.stringify(bodyObj),
    })
    const data=await response.json();
    console.log("data added to db:",data);
}