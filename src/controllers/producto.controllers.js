import Producto from "../models/Producto.js";

export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const getProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

export const createProducto = async (req, res) => {
  try {
    const { nombre, precio, imagen, detalles, etiqueta, categoria } = req.body;

    if (!nombre || !precio || !imagen || !detalles || !categoria) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const nuevoProducto = new Producto({ nombre, precio, imagen, detalles, etiqueta, categoria });
    await nuevoProducto.save();
    res.status(201).json({ mensaje: "Producto creado", producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!productoActualizado) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ mensaje: "Producto actualizado", producto: productoActualizado });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
