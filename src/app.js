import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import categoriasRoutes from './routes/categorias.routes.js';
import productosRoutes from './routes/productos.routes.js';

import sucursalesRoutes from './routes/sucursales.routes.js';
import proveedoresRoutes from './routes/proveedores.routes.js';



const app = express();

app.set("port", process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

// Sirve la carpeta de imágenes del frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/img', express.static(path.join(__dirname, '../../frontend/img')));

app.use("/api/categorias", categoriasRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/sucursales", sucursalesRoutes);
app.use("/api/proveedores", proveedoresRoutes);


export default app;