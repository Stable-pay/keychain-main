"use server";
import axios from "axios";
import NodeCache from "node-cache";
var CryptoJS = require('crypto-js');

const cache = new NodeCache({ stdTTL: 300 }); // Cache with a 10-minute expiry

const fetchTransfiData = async (currency:string) => {
  if(currency!=="USD"){
    return null;
  }

  // TRANSFI API CALL
  const transfiData = await axios.get(
    `https://sandbox-api.transfi.com/sell/quotes?cryptoTicker=USDC&fiatTicker=${currency}&baseTicker=crypto&amount=1`,
    {
      auth: {
        username: "stablelabscorp",
        password: "0eFrdrdeP0bcsyql",
      },
    }
  );

  return transfiData.data.message.success
    ? { provider: "transfi", amount: transfiData.data.message.data.cryptoPrice }
    : null;
};

const fetchOnrampMoneyData = async (currency :string) => {
  if (currency === "INR") {
    try{
        const onrampMoneyData = await fetch(
          'https://keychain-api.onrender.com/api/exchange/',
          // 'http://localhost:8000/api/exchange/exchange-rate/',
          {
            next:{
              revalidate:300,
            }
          }
        );
    
        const response=await onrampMoneyData.json();
          console.log("INR:response",response);


        return { provider: "onramp", amount: response.data.rate};
        
      }catch(err){
        console.log("Data fetching onramp error:",err);
      }
      
  }
  return null;
};

const fetchKoyweData= async (currency: string) => {
  const currencies=["CLP", "MXN","PEN","COP"];
  if(currencies.includes(currency)){
    try{
      const bodyObj={
        amountIn:100,
        symbolIn:"USDC",
        symbolOut:currency,
        clientId:process.env.NEXT_PUBLIC_KOYWE_ID!
      }
      const koyweData=await fetch('https://api-test.koywe.com/rest/quotes',{
        next:{
          revalidate:300,
        },
        body:JSON.stringify(bodyObj),
        method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
      }).then(res => res.json());
      console.log("koywe response:",koyweData);
      return { provider: "koywe", amount: koyweData.exchangeRate};
    }catch(err){
      console.log("error fetching koywe data:",err);
    }
    return null;
  }
  return null;
}

const offRampFunction = async (currency:string) => {
  const cacheKey = `offRamp_${currency}`;

  // Check if the result is already in the cache
  const cachedResult :any = cache.get(cacheKey);
  if (cachedResult) {
    console.log('Using cached data for', currency);
    return cachedResult;
  }

  // Fetch data from both routes in parallel
  const [transfiData, onrampMoneyData, koyweData] = await Promise.all([
    fetchTransfiData(currency),
    fetchOnrampMoneyData(currency),
    fetchKoyweData(currency),
  ]);

  // Combine the results from both routes
  let currencyRateArray = [transfiData, onrampMoneyData,koyweData].filter((data) => data !== null);
  currencyRateArray.sort((a, b) => b?.amount - a?.amount);

  // Store the result in the cache with a 1-minute expiry
  cache.set(cacheKey, currencyRateArray[0]);

  return currencyRateArray[0];
};

const getConversionAmount = async (
    fromCountry: string,
    toCountry: string,
    amount: number
  ) => {
    try {
      const fromCountryRate :any = await offRampFunction(fromCountry);
      const toCountryRate :any = await offRampFunction(toCountry);
      console.log(
        `rate: ${
          toCountryRate?.amount / fromCountryRate?.amount
        }, amount: ${amount * (toCountryRate?.amount / fromCountryRate?.amount)}, fromCountryRate: ${
          fromCountryRate?.amount
        }, toCountryRate: ${toCountryRate?.amount}`
      );

      if(!fromCountryRate || !toCountryRate){
        return 0;
      }
  
      return toCountryRate?.amount / fromCountryRate?.amount;
    } catch (error) {
      console.log(error, "getConversionAmount Function Error");
      throw new Error('Unable to fetch data');
    }
  };

export default getConversionAmount;

export {offRampFunction};