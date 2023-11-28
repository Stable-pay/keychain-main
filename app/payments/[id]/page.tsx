import TransactionDetailsComponent from "@/components/TransactionDetailsComponent";
import { connectToDatabase } from "@/database";
import Transaction from "@/models/transactions";

export const revalidate=5;

export default async function Page({ params }: { params: { id: string } }) {
      await connectToDatabase();
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
        'status',
      ];

      // Add a special case to exclude the _id field
      selectedFields.push('-_id');

      console.log(`txnId`,transactionId);

      const transaction = await Transaction.findOne({hashId:transactionId})
      .select(selectedFields.join(' ')) // Join the field names with spaces

      console.log("transaction:",transaction);

  // const data:TransactionProps = await fetch(`/api/transactions?hashId=${params.id}`,{
  //   next:{
  //     revalidate:5,
  //   },
  //   cache:'default',
  // }).then(response => response.json());
  // if(!data){
  //   return null;
  // }
  if(!transaction)return null;
  const txn:TransactionProps=transaction;
  return (
    <TransactionDetailsComponent transaction={txn} /> 
  )
}