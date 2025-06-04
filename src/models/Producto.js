import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // id único como string (puedes cambiar a Number si prefieres)
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String },
  detalles: { type: String },
  etiqueta: { type: String },
  categoria: { type: String, enum: ["Cervezas", "Cócteles", "Licores"] },
});

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;
