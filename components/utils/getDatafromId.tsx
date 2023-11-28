import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const getDataFromId=(id?:string) => {
    const decodedToken=jwt.verify(cookies().get('sendOptions')?.value!,process.env.TOKEN_SECRET!);
    console.log(decodedToken);
    return decodedToken;
}