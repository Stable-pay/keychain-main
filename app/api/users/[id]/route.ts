import { connectToDatabase } from "@/database";
import Transaction from "@/models/transactions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,
    {params}:{
        params:{id:string}
    }
) {
    try {
      await connectToDatabase();
  
    //   const smartContractAddress = parseCookies().smartContractAddress;
      const smartContractAddress=params.id;

        console.log(`smartContract ${smartContractAddress}`);
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