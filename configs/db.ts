import mongoose from "mongoose";

const connectToDB = async () => {

   try {

      const uri = process.env.MONGODB_URL;

      if (!uri) {
         throw new Error("MONGODB_URL is not defined");
      }

      if (mongoose.connections[0].readyState !== 0) {
         return true;
      }

      await mongoose.connect( uri );

      console.log(`✅ Connected To DB Successfully.`);
      
   } catch (error) {
      
      console.log(`❌ Error DB Connection - ${(error instanceof Error) ? (error?.message ?? error.toString()) : "Unknown Error"}`);
   }
}


export default connectToDB;