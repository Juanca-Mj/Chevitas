import { Router } from "express";
const router = Router();

let productos = [
  {
    id: "aguardiente-amarillo-750ml",
    nombre: "Aguardiente Amarillo 750ml",
    precio: 42000,
    imagen: "img/aguardiente-amarillo-750ml.jpg",
    detalles: "750ml • 29% Alc. • Licor Anisado • Origen: Colombia",
    etiqueta: "Popular"
  },
  {
    id: "cerveza-coronita",
    nombre: "Cerveza Coronita",
    precio: 5500,
    imagen: "img/cerveza-coronita.jpg",
    detalles: "210ml • 4.5% Alc. • Lager • Origen: México",
    etiqueta: ""
  },
  {
    id: "coctel-infame",
    nombre: "Cóctel Infame",
    precio: 12000,
    imagen: "img/coctel-infame.jpg",
    detalles: "355ml • 7% Alc. • Listo para tomar • Origen: Colombia",
    etiqueta: "Nuevo"
  }
];

// Obtener todos los productos
router.get("/", (req, res) => {
  res.json(productos);
});

// Agregar un producto nuevo
router.post("/", (req, res) => {
  const nuevoProducto = req.body;
  if (!nuevoProducto.id || !nuevoProducto.nombre || !nuevoProducto.precio) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  productos.push(nuevoProducto);
  res.status(201).json({ mensaje: "Producto agregado", producto: nuevoProducto });
});

// Eliminar producto por ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = productos.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  const eliminado = productos.splice(index, 1);
  res.json({ mensaje: "Producto eliminado", producto: eliminado[0] });
});

export default router;