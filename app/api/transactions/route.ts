import { connectToDatabase } from "@/database";
import Transaction from "@/models/transactions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,res:NextResponse){
    try{
        const {searchParams} = new URL(req.url);

        const body=await req.json();
        await connectToDatabase();

        const transaction=await Transaction.create(body);

        return NextResponse.json(transaction,{status:201});
    }catch(err){
        return NextResponse.json({message:"Server error"},{status:500})
    }
}


export async function GET(req: NextRequest) {
    try {
      await connectToDatabase();
      const {searchParams} = new URL(req.url);
    //   const smartContractAddress = parseCookies().smartContractAddress;
      const transactionId=searchParams.get('hashId');
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
        'status',
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

  export async function PUT(req: NextRequest) {
    try {
      await connectToDatabase();
      const { searchParams } = new URL(req.url);
      const transactionId = searchParams.get('hashId');
  
      const updatedFields = {
        // receiverAddress=null
      }; // Create an object to store updated fields
      const requestBody = await req.json(); // Assuming you're sending the new receiverAddress in the request body
  
      if (!requestBody.receiverAddress) {
        return NextResponse.json({message:"Smart Contract not found"},{status:500})
        // updatedFields.receiverAddress = requestBody.receiverAddress;
      }
  
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { hashId: transactionId },
        { $set: requestBody },
        { new: true } // Return the updated document
      );
  
      if (!updatedTransaction) {
        return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
      }
  
      return NextResponse.json(updatedTransaction, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  }