import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        senderAddress: {
            type: String,
            required: true,
        },
        receiverAddress: {
            type: String,
            default:"",
        },
        sentAmount:{
            type:Number,
            required:true,
        },
        usdc_transferred:{
            type:Number,
            required:true,
        },
        exchangeRate: {
            type: Number,
            default:1.0,
        },
        category:{
            type:String,
            required:true,
            default:"Send",
        },
        status:{
            type:String,
            default:"Pending"
        },
        hashId:{
            type:String,

        },
        sender_currency:{
            type:String, //baseCurrency 
            /*
                flow:
                1-> update baseCurrency  
                2-> peanut protocol -|
                3-> transaction is created in the database ->objectId -|
                4-> copy link & share link functionalities 
                5-> claim link 
                6-> transaction is updated with the receiver address 
            */
           default:"USD",
        },
        receiver_currency:{
            type:String, //quoteCurrency -> via link we're updating quote currency 
            default:"INR",
        },
        note:{
            type:String,
            default:'',
        },
        link:{
            type:String,
            default:'',
        }
    },
    {
        timestamps: true,
    })

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)

export default  Transaction;