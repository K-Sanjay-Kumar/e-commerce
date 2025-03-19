import mongoose from 'mongoose';

export const connectDB = async () => {
    const MONGO_URI=process.env.MONGODB_URI;
    try{
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1); //1 code means exit with failure, 0 means success
    }
}