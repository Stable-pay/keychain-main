import { FormSkeleton } from "@/components/Form";
import { getDataFromId } from "@/components/utils/getDatafromId";
import { Suspense } from "react";
import Form from "./Form";

type prevData={
  sentAmount:string,
  receiver_currency:string,
  sender_currency:string,
  iat:number,
}

const SendOptionsPage = async ({ params }: { params: { id: string } }) => {
    const getPrevData:any=await getDataFromId(params.id);
  return (
    <main className="flex-center paddings mx-auto w-full max-w-screen-2xl flex-col">
      <Suspense fallback={<FormSkeleton />}>
        <Form receiver_currency={getPrevData.receiver_currency} sender_currency={getPrevData.sender_currency} sentAmount={getPrevData.sentAmount} exchangeRate={getPrevData.exchangeRate} />
      </Suspense>
    </main>
  )
}

export default SendOptionsPage