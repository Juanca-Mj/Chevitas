import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Conectado a MongoDB Atlas");
  } catch (error) {
    console.error(" Error al conectar a MongoDB:", error.message);
    process.exit(1); // Detener si falla
  }
};

export default connectDB;
