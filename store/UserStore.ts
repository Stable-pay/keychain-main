import { create } from "zustand";


interface userState{
    smartContractAddress:string,
    setSmartContractAddress:(smart_contract_address:string) => void,
    eoaWalletAddress:string,
    setEoaWalletAddress:(eoaWalletAddress:string) => void,
}

export const userStore=create<userState>((set,get) => ({
    smartContractAddress:"",
    setSmartContractAddress: async (smartContractAddress:string) => set({smartContractAddress}),
    eoaWalletAddress:"",
    setEoaWalletAddress:async (eoaWalletAddress:string) => set({eoaWalletAddress}),
}))