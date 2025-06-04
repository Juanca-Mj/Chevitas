// src/models/Sucursal.js
import mongoose from "mongoose";

const sucursalSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  telefono: { type: String },
  ciudad: { type: String },
  horario: { type: String }
});

const Sucursal = mongoose.model("Sucursal", sucursalSchema);

export default Sucursal;
