import { Router } from "express";
import Producto from "../models/Producto.js";

const router = Router();

const S3_URL = "https://chevechita-imgs.s3.us-east-2.amazonaws.com/";

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    let productos = await Producto.find({});
    productos = productos.map((p) => {
      const prod = p.toObject();
      if (prod.imagen && !prod.imagen.startsWith("http")) {
        prod.imagen = S3_URL + prod.imagen.replace(/^img[\\/]/, "");
      }
      return prod;
    });
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findOne({ id: req.params.id });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    const prod = producto.toObject();
    if (prod.imagen && !prod.imagen.startsWith("http")) {
      prod.imagen = S3_URL + prod.imagen.replace(/^img[\\/]/, "");
    }
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

// Crear producto
router.post("/", async (req, res) => {
  const { id, nombre, precio, imagen, detalles, etiqueta, categoria } = req.body;
  if (!id || !nombre || !precio) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  try {
    const nuevoProducto = new Producto({
      id,
      nombre,
      precio,
      imagen,
      detalles,
      etiqueta,
      categoria,
    });
    await nuevoProducto.save();
    res.status(201).json({ mensaje: "Producto agregado", producto: nuevoProducto });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "El ID del producto ya existe" });
    }
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// Actualizar producto
router.put("/:id", async (req, res) => {
  const { nombre, precio, imagen, detalles, etiqueta, categoria } = req.body;
  try {
    const productoActualizado = await Producto.findOneAndUpdate(
      { id: req.params.id },
      { nombre, precio, imagen, detalles, etiqueta, categoria },
      { new: true }
    );
    if (!productoActualizado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto actualizado", producto: productoActualizado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    const productoEliminado = await Producto.findOneAndDelete({ id: req.params.id });
    if (!productoEliminado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;
