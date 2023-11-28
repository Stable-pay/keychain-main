import HistoryComponent from "@/components/HistoryComponent";
import { connectToDatabase } from "@/database";
import Transaction from "@/models/transactions";
import { getAddress } from "../actions";

export const revalidate=300;

// Function to update the MongoDB database with PolygonScan transactions
async function updateDatabaseWithPolygonScanTransactions(polyScanTransactions:any) {
    try {
      for (const polyScanTransaction of polyScanTransactions.result) {
        const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        if (currentTime - polyScanTransaction.timeStamp > 24 * 60 * 60) continue;
        // Check if the transaction with this hash exists in the database
        const existingTransaction = await Transaction.findOne({ hashId: polyScanTransaction.hash });
  
        if (!existingTransaction) {
          // Transaction not found in the database, insert a new record
          const newTransaction = {
            senderAddress: polyScanTransaction.from,
            receiverAddress: polyScanTransaction.to,
            sentAmount: parseFloat(polyScanTransaction.value)/10**6,
            usdc_transferred: parseFloat(polyScanTransaction.value)/10**6,
            exchangeRate: 1.0, // You may need to fetch the exchange rate from somewhere
            category: "External Transaction", // Adjust as needed
            status: "Completed", // Adjust as needed
            hashId: polyScanTransaction.hash,
            sender_currency: "USD", // Adjust as needed
            receiver_currency: "USD", // Adjust as needed
            note: "", // You may want to fetch additional information from PolygonScan
            link: "", // You may want to fetch additional information from PolygonScan
          };
  
          await Transaction.create(newTransaction);
          console.log(`Transaction added to the database: ${polyScanTransaction.hash}`);
        } else {
          console.log(`Transaction already exists in the database: ${polyScanTransaction.hash}`);
        }
      }
  
      console.log("Database update completed.");
    } catch (error) {
      console.error("Error updating database:", error);
    }
  }
  
 
async function getInternalTransactions() {
    await connectToDatabase();
    const smartContractAddress=getAddress();
    const transactions = await Transaction.find(
        {
        $or: [{ senderAddress: smartContractAddress?.toLocaleLowerCase()},{ senderAddress: smartContractAddress}, { receiverAddress: smartContractAddress?.toLocaleLowerCase()},{receiverAddress:smartContractAddress}],
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
    return transactions;
}

async function getExternalTransactions() {
     // Example usage
    // Call this function with the transactions fetched from PolygonScan
    const polyScanTransactions = await fetch(`https://api.polygonscan.com/api?startblock=0&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_POLYGON_API}&module=account&action=tokentx&contractaddress=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&address=${getAddress()}&offset=5`);
    const polyScanTransactionsJson=await polyScanTransactions.json();
    // console.log("external txns:",polyScanTransactionsJson);
    await updateDatabaseWithPolygonScanTransactions(polyScanTransactionsJson);

}

export default async function Page(){
    await connectToDatabase();

    await getExternalTransactions();

    const transactions = await getInternalTransactions();
    // console.log("transactions:",transactions);
    if(!transactions){
        return null;
    }

    return <HistoryComponent transactions={transactions} />
}