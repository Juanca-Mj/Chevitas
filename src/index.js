import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const main = async () => {
  try {
    // Conexión a MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a MongoDB Atlas");

    // Iniciar servidor
    app.listen(app.get("port"), '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en el puerto ${app.get("port")}`);
    });
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1); // Detiene la app si falla la conexión
  }
};

main();
