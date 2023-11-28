import LoadingComponent from "@/components/LoadingComponent"
import dynamic from "next/dynamic"

const QrCode = dynamic(() => import ('@/components/QRCode'),{
    loading:() => <LoadingComponent />
})

// export const revalidate=300;

const QRCode = () => {
  return (
    <></>
    // <QrCode />
  )
}

export default QRCode