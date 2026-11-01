import mongoose from "mongoose";

const connectToDB = async () => {

   try {

      if (mongoose.connections[0].readyState !== 0) {
         return true;
      }

      await mongoose.connect( process.env.MONGODB_URL );

      console.log(`✅ Connected To DB Successfully.`);
      
   } catch (error) {
      
      console.log(`❌ Error DB Connection - ${error?.message ?? error.toString() ?? "Unknown Error"}`);
   }
}


export default connectToDB;