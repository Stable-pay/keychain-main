import { NextRequest, NextResponse } from "next/server";
var CryptoJS = require('crypto-js');
import jwt from "jsonwebtoken";

export async function POST(req:NextRequest,res:NextResponse){
    try {
        
        const body=await req.json();
        console.log("body",body);

        //body : token 

        // verify the token 
        const decodedToken=jwt.verify(body,process.env.TOKEN_SECRET!);
        console.log("from submit route:",decodedToken);

        return NextResponse.json({message:"success"},{status:201});

      } catch (error) {
        console.log(error)
      }
}