import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Transaction from "@/models/transactions";
import { connectToDatabase } from "@/database";
import jwt from "jsonwebtoken";

export async function POST(req:NextRequest,res:NextResponse){
    try{

        const body=await req.json();
        console.log("body:",body);

        const cookieStore=cookies();

        if(cookieStore.has('smartContractAddress')){
            return NextResponse.json({message:"Successfully executed!!"},{status:200});
        }
        if(body.address!=="")
            cookieStore.set('smartContractAddress',body?.address);

        return NextResponse.json({message:"Successfully executed!!"},{status:200});
    }catch(err){
        return NextResponse.json({message:"Server error"},{status:500})
    }
}

export async function GET(req:NextRequest,res:NextResponse){
    try {
        await connectToDatabase();
    
      //   const smartContractAddress = parseCookies().smartContractAddress;
        const token=cookies().get('token')?.value;
        if(!token)return NextResponse.json({ message: "Server error" }, { status: 500 });

        const smartToken:any=jwt.decode(token);
        const smartContractAddress=smartToken.address;
  
        // Find transactions where senderAddress or receiverAddress matches smartContractAddress
        // Find transactions where senderAddress or receiverAddress matches smartContractAddress
      const transactions = await Transaction.find(
          {
            $or: [{ senderAddress: smartContractAddress }, { receiverAddress: smartContractAddress}],
          },
          // Select only the desired fields
          {
            senderAddress: 1,
            receiverAddress: 1,
            exchangeRate: 1,
            sender_currency: 1,
            receiver_currency: 1,
            sentAmount: 1,
            hashId:1,
            createdAt:1,
            usdc_transferred:1,
            _id: 0, // Exclude the _id field
          }
        ).sort({createdAt:-1});
    
        return NextResponse.json(transactions, { status: 200 });
      } catch (err) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
      }
}