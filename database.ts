// mongo.js
"use server"
import mongoose from "mongoose";

const uri=process.env.NEXT_PUBLIC_MONGO_URI!;

if(!uri){
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    )
}

let cachedDb:any=null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

    try {
        const opts = {
            bufferCommands : false
        };
        cachedDb = await mongoose.connect(uri, opts).then((mongoose) => {
            return mongoose
        });
    } catch (e) {
        cachedDb = null;
        throw e;
    }

    return cachedDb;
}

// async function disconnectFromDatabase() {
//   try {
//     if (cachedDb) {
//       await client.close();
//       console.log('Disconnected from MongoDB');
//     }
//   } catch (error) {
//     console.error('Error disconnecting from MongoDB:', error);
//   }
// }

export { connectToDatabase };
