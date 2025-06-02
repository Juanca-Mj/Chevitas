import { Router } from "express";
import getConnection from "../db/database.js";
const router = Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const conn = await getConnection();
    const productos = await conn.query("SELECT * FROM productos");
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const conn = await getConnection();
    const [producto] = await conn.query("SELECT * FROM productos WHERE id = ?", [req.params.id]);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (err) {
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
    const conn = await getConnection();
    await conn.query(
      "INSERT INTO productos (id, nombre, precio, imagen, detalles, etiqueta, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, nombre, precio, imagen, detalles, etiqueta, categoria]
    );
    res.status(201).json({ mensaje: "Producto agregado", producto: req.body });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// Actualizar producto
router.put("/:id", async (req, res) => {
  const { nombre, precio, imagen, detalles, etiqueta, categoria } = req.body;
  try {
    const conn = await getConnection();
    const result = await conn.query(
      "UPDATE productos SET nombre=?, precio=?, imagen=?, detalles=?, etiqueta=?, categoria=? WHERE id=?",
      [nombre, precio, imagen, detalles, etiqueta, categoria, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.query("DELETE FROM productos WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;