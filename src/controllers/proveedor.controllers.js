import Proveedor from '../models/Proveedores.js';


// Obtener todos los proveedores
export const getProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.json(proveedores);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener proveedores" });
  }
};

// Obtener un proveedor por ID
export const getProveedor = async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) return res.status(404).json({ error: "Proveedor no encontrado" });
    res.json(proveedor);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener proveedor" });
  }
};

// Crear un proveedor nuevo
export const createProveedor = async (req, res) => {
  try {
    const nuevoProveedor = new Proveedor(req.body);
    await nuevoProveedor.save();
    res.status(201).json(nuevoProveedor);
  } catch (err) {
    res.status(400).json({ error: "Error al crear proveedor" });
  }
};

// Actualizar un proveedor
export const updateProveedor = async (req, res) => {
  try {
    const proveedorActualizado = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!proveedorActualizado) return res.status(404).json({ error: "Proveedor no encontrado" });
    res.json(proveedorActualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar proveedor" });
  }
};

// Eliminar un proveedor
export const deleteProveedor = async (req, res) => {
  try {
    const proveedorEliminado = await Proveedor.findByIdAndDelete(req.params.id);
    if (!proveedorEliminado) return res.status(404).json({ error: "Proveedor no encontrado" });
    res.json({ mensaje: "Proveedor eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar proveedor" });
  }
};
