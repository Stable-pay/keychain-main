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
      const transactionId=params.id;
      const selectedFields = [
        'senderAddress',
        'receiverAddress',
        'sentAmount',
        'sender_currency',
        'hashId',
        'link',
        'note',
        'usdc_transferred',
        'createdAt',
      ];

      // Add a special case to exclude the _id field
        selectedFields.push('-_id');

        console.log(`txnId`,transactionId);

      const transaction = await Transaction.findOne({hashId:transactionId})
      .select(selectedFields.join(' ')) // Join the field names with spaces

  
      return NextResponse.json(transaction, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  }