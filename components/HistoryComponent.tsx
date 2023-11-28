import LoadingComponent from "./LoadingComponent";
import Link from "next/link";
import { getAddress } from "@/app/actions";

type GroupedTransactions = Record<string, TransactionProps[]>;
type Props= {transactions:TransactionProps[]};
type transactionProps=[date:string,transactionDetail:TransactionProps[]];

const HistoryComponent = ({transactions}:Props) => {

    function groupTransactionsByMonth(transactions: TransactionProps[]): GroupedTransactions {
        const grouped: GroupedTransactions = {};
      
        for (const transaction of transactions) {
          const date = new Date(transaction.createdAt || "");
          const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          if (!grouped[month]) {
            grouped[month] = [];
          }
          grouped[month].push(transaction);
        }
      
        return grouped;
      }

    if(!transactions){
        return <LoadingComponent />
    }

    const smartContractAddress=getAddress();
    
  return (
    <div className="w-screen flex-center">
        <div className="md:max-h-[85vh] max-h-[90vh] w-full md:w-3/4 self-center bg-black-400 py-3 flex flex-col overflow-auto shadow shadow-white-400 rounded no-scrollbar">
            
            {Object.entries(groupTransactionsByMonth(transactions)).map(([month,transactions]:transactionProps) => {
                return (
                    <div className="bg-black-300" key={month}>
                        <p className="md:heading1 heading2 text-white-800 flex-center w-full py-6 text-center">{month}</p>
                        {transactions.map((transaction:TransactionProps) => {
                            const amount=Number(transaction.sentAmount);
                            const showAmount=Number(amount.toFixed(3));
                            const utcDateString = transaction.createdAt;
                            const utcDate = new Date(utcDateString || "");

                            // Convert UTC date to local date
                            const localDate = new Date(utcDate);

                            // To get the local date and time as a string
                            const localDateString = localDate.toLocaleString('default', { month: 'long', day: 'numeric' });
                            return (
                                <div key={transaction.hashId} className=" py-7 w-full bg-black-400 gap-y-4 text-white-400 mt-2 flex items-center justify-around rounded">
                                    <Link href={`/payments/${transaction.hashId}`} className="hover:cursor-pointer flex-center w-full">
                                        <p className={`heading4 w-3/4 text-center flex-center`}>{transaction.senderAddress==smartContractAddress?'Sent on':'Received on'} {localDateString}</p>
                                        <p className={`text-center w-1/4 heading4 ${transaction.senderAddress==smartContractAddress?'text-[#DC143C]':'text-[#2ecc71]'}`}>{transaction.senderAddress==smartContractAddress?'-':'+'}{showAmount} {transaction.sender_currency}</p>
                                    </Link>
                                    
                                </div>
                            )
                        })}
                    </div>
                )
            })}
            {transactions.length===0 && (
                 <div className="text-white-400 w-full flex-center font-bold mt-10 heading2">
                    <p><b className="text-gradient_pink-orange">No transactions</b> yet... Start to delve into the world of future <b className="text-gradient_blue-purple">digital payments.</b></p>
                </div>
            )}
        </div>
    </div>
  )
}

export default HistoryComponent