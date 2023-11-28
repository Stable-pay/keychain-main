import dynamic from "next/dynamic"
import LoadingComponent from "./LoadingComponent";

const SendTransactionComponent = dynamic(() => import("./SendTransactionComponent"),{
    loading: () => <LoadingComponent />
})

const Scan = dynamic(() => import("./Scan"),{
    loading: () => <LoadingComponent />
})

type Props = {
    feature?:string | string[] | undefined;
}

const Body = (props:Props) => {
    const {feature}=props;
    if(feature==='scan'){
        return <Scan />
    }
  return (
   <SendTransactionComponent />
  )
}
 
export default Body