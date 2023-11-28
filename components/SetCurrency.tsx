"use client";
import { setBaseCurrencyCookie } from "@/app/actions";
import {fiatCurrencies} from "@/lib/fiatCurrencies"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
type Props = {
    onSelect: (option: string) => void;
    isOpen?: boolean;
    toggleDropdown?: () => void;
    isBaseCurrency?:boolean;
}


const SetCurrency= ({isOpen,onSelect,toggleDropdown,isBaseCurrency}:Props) => {
    const [currencies,setCurrencies]=useState(fiatCurrencies);
    const [searchQuery,setSearchQuery]=useState("");

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value=e.target.value;
        const tempCurrencies=fiatCurrencies;
        setSearchQuery(value);
        setCurrencies(tempCurrencies.filter(country => country.currency_code.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || country.currency_name.toLocaleLowerCase().includes(value.toLocaleLowerCase())));
    };

    const handleCurrencySelection=async (currency_code:string) => {
        onSelect(currency_code);
        if(isBaseCurrency){
            await setBaseCurrencyCookie(currency_code);
        }
        if(toggleDropdown)
            toggleDropdown();
    }   

    return (
        <div className="h-screen w-screen backdrop-blur-lg z-100 fixed top-0 left-0 bottom-0 right-0 flex-center">
        <div className="h-[60vh] w-[100vw] md:w-[60vw] fixed backdrop-blur-sm z-100 flex flex-col rounded-md px-4 justify-around no-scrollbar">
            {isBaseCurrency && <div className="heading3 md:heading2 text-gradient_pink-orange py-4">Please select base currency</div>}
            <div className={`h-50 overflow-auto w-120 bg-white divide-y divide-gray-100 rounded-lg shadow `}>
                    <div className='p-3 overflow-auto flex items-center '>
                        <MagnifyingGlassIcon className='h-6 text-gray-500' />
                        <input className='outline-none' type="text" onChange={handleChange} placeholder="Search your country" value={searchQuery} />
                    </div>
                    <ul className="p-3 space-y-1 text-sm text-gray-700" aria-labelledby="dropdownRadioBgHoverButton">
                        {currencies.map(({currency_name,currency_code}:{currency_name:string,currency_code:string},index) => (
                            <li key={index} className='hover:cursor-pointer'>
                                <div className={`flex items-center p-2 rounded hover:cursor-pointer `} onClick={() => handleCurrencySelection(currency_code)}>
                                    <input id="default-radio-4" type="radio" value="" name="default-radio" className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 hover:cursor-pointer`} />
                                    <label className="w-full ml-2 text-sm font-medium text-gray-900 rounded hover:cursor-pointer">{currency_name} - {currency_code}</label>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
        </div>
        </div>
    )

}

export default SetCurrency