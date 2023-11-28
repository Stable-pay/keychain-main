import { getBaseCurrency } from "@/app/actions";
import { create } from "zustand";


interface CurrencyState{
    baseCurrency:string,
    receiverCurrency:string,
    setBaseCurrency:(baseCurrency:string) => void,
    setReceiverCurrency: (receiverCurrency:string) => void,
    getCurrency: () => Promise<string>,
}

export const useCurrencyStore=create<CurrencyState>((set,get) => ({
    baseCurrency:"USD",
    receiverCurrency:"INR",
    setBaseCurrency:async (baseCurrency:string) => set({baseCurrency}),
    setReceiverCurrency:async (receiverCurrency:string) => set({receiverCurrency}),
    getCurrency : async () => {
        const baseCurrency=await getBaseCurrency();
        return baseCurrency || ""; 
    },
}))