"use client";
import jwt from "jsonwebtoken";

export const getAddress=() => {
    const smartContractToken:any=jwt.decode(localStorage.getItem('token')!);
    if(smartContractToken==null)return '';
    const smartContractAddress=smartContractToken.address;
    return smartContractAddress as string;
}