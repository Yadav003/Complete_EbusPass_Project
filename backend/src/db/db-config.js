import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Drop stale 'username_1' index left over from an old schema version
    try {
      await conn.connection.collection("users").dropIndex("username_1");
      console.log("Dropped stale index: username_1");
    } catch (_) {
      // Index doesn't exist — nothing to do
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  } 
};

export default connectDB;