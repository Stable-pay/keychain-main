"use client";
import { getAddress, setBaseCurrencyCookie } from "@/app/actions";
import { fiatCurrencies } from "@/lib/fiatCurrencies";
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { KoyweRampSDK } from "@koyweforest/koywe-ramp-sdk";
import Link from "next/link";

type Props = {
  isOpen?: boolean;
  toggleWithdraw?: () => void;
};

const WithdrawFundsButton = ({ isOpen, toggleWithdraw }: Props) => {
  const [currencies, setCurrencies] = useState(fiatCurrencies);
  const [searchQuery, setSearchQuery] = useState("");
  const koyweCurrencies = ["CLP", "MXN","PEN","COP"];
  // const koywe = new KoyweRampSDK({
  //   clientId: process.env.NEXT_PUBLIC_KOYWE_ID!,
  //   address: getAddress(),
  //   tokens: ["USDC Polygon"],
  //   callbackUrl: "http://localhost:3000/account",
  // });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    const tempCurrencies = fiatCurrencies;
    setSearchQuery(value);
    setCurrencies(
      tempCurrencies.filter(
        (country) =>
          country.currency_code
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          country.currency_name
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
      )
    );
  };

  const handleKoyweCurrencySelection=(currency_code:string) => {
    const koywe = new KoyweRampSDK({
      clientId: process.env.NEXT_PUBLIC_KOYWE_ID!,
      address: getAddress(),
      tokens: ["USDC Polygon"],
      callbackUrl: "http://stable-pay-mukul202.vercel.app/account",
      currencies:[currency_code],      
    });
    koywe.show();
  }

  return (
    <div className="h-screen w-screen backdrop-blur-lg z-100 absolute flex-center top-0 left-0 bottom-0 right-0">
      <div className="h-[60vh] w-[100vw] md:w-[60vw] fixed backdrop-blur-sm z-100 flex flex-col bg-black-400 rounded-md px-4 justify-around">
        {isOpen && (
          <div className="heading3 md:heading3 text-gradient_pink-orange py-4 flex justify-between">
            Please select withdrawal currency
            <XCircleIcon className='h-10 w-10 rounded-full bg-white hover:bg-purple hover:cursor-pointer' onClick={toggleWithdraw} />
          </div>
        )}
        <div
          className={`h-50 overflow-auto w-120 bg-white divide-y divide-gray-100 rounded-lg shadow `}
        >
          <div className="p-3 overflow-auto flex items-center ">
            <MagnifyingGlassIcon className="h-6 text-gray-500" />
            <input
              className="outline-none"
              type="text"
              onChange={handleChange}
              placeholder="Search your country"
              value={searchQuery}
            />
          </div>
          <ul
            className="p-3 space-y-1 text-sm text-gray-700"
            aria-labelledby="dropdownRadioBgHoverButton"
          >
            {currencies.map(
              (
                {
                  currency_name,
                  currency_code,
                }: { currency_name: string; currency_code: string },
                index
              ) => (
                <li key={index} className="hover:cursor-pointer">
                  {currency_code === "INR" ? (
                    <Link
                      href={
                        "https://onramp.money/main/sell/?appId=625451&coinCode=usdc"
                      }
                    >
                      <div
                        className={`flex items-center p-2 rounded hover:cursor-pointer `}
                      >
                        <input
                          id="default-radio-4"
                          type="radio"
                          value=""
                          name="default-radio"
                          className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 `}
                        />
                        <label className="w-full ml-2 text-sm font-medium text-gray-900 rounded">
                          {currency_name} - {currency_code}
                        </label>
                      </div>
                    </Link>
                  ) : koyweCurrencies.includes(currency_code) ? (
                    <div
                      className={`flex items-center p-2 rounded hover:cursor-pointer `}
                      onClick={() => handleKoyweCurrencySelection(currency_code)}
                    >
                      <input
                        id="default-radio-4"
                        type="radio"
                        value=""
                        name="default-radio"
                        className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 `}
                      />
                      <label className="w-full ml-2 text-sm font-medium text-gray-900 rounded">
                        {currency_name} - {currency_code}
                      </label>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center p-2 rounded hover:cursor-pointer `}
                      onClick={toggleWithdraw}
                    >
                      <input
                        id="default-radio-4"
                        type="radio"
                        value=""
                        name="default-radio"
                        className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 `}
                      />
                      <label className="w-full ml-2 text-sm font-medium text-gray-900 rounded">
                        {currency_name} - {currency_code}
                      </label>
                    </div>
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WithdrawFundsButton;