"use client";
import { PrivyProvider } from "@privy-io/react-auth";

const HandleLogin=async (user:any,isNewUser:any) => {
    // const {user}=usePrivySmartAccount();
    // if(user?.wallet){
    //     setCookie(null,'eoaAddress',JSON.stringify(user?.wallet?.address),{
    //         maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    //         path: '/', // Cookie available to all paths
    //     })
    // }
}

function PrivyProviderB({children}:{children: React.ReactNode}){
    return (
    <PrivyProvider
        appId={process.env.NEXT_PUBLIC_APP_ID!}
        onSuccess={HandleLogin}
        config={{
            loginMethods:[
                "wallet",
                "sms",
                "google",
                "email",
                "discord",
                "twitter",
            ],
            embeddedWallets:{
                createOnLogin:"users-without-wallets",
                noPromptOnSignature:true,
                requireUserPasswordOnCreate: true
            },
            appearance:{
                accentColor:"#676FFF",
                theme:"light",
                logo:"payments.png",
            },
            
        }}

    >
        {children}
    </PrivyProvider>
    );
}

export default PrivyProviderB;