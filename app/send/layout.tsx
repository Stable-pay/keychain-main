import { getDataFromId } from "@/components/utils/getDatafromId"

export default function Layout(props: {
    children: React.ReactNode
    user: React.ReactNode
    link: React.ReactNode
  }) {
    const sendToUser:any=getDataFromId();
    return (
        sendToUser.receiverAddress!==''?props.user:props.link
    )
  }