// src/models/Proveedor.js
import mongoose from 'mongoose';

const proveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contacto: String,
  telefono: String,
  email: String,
  direccion: String
}, { collection: 'proveedores' });

const Proveedor = mongoose.model('Proveedor', proveedorSchema);
export default Proveedor;

