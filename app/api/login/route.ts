import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import  jwt from "jsonwebtoken";

export async function POST(req:NextRequest,res:NextResponse){
    try{

        const body=await req.json();
        console.log("body:",body);

        const cookieStore=cookies();

        if(cookieStore.has('token')){
            return NextResponse.json({token:cookieStore.get('token')?.value,success:true},{status:200});
        }
        
        const token = jwt.sign({
            address:body.address,
        },process.env.TOKEN_SECRET!);

        cookieStore.set('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict",
        });

        // console.log(token);

        return NextResponse.json({success:true, token},{status:200});
    }catch(err){
        return NextResponse.json({error:err},{status:500})
    }
}