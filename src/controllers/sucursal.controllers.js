import Sucursal from "../models/Sucursales.js";

export const getSucursales = async (req, res) => {
  try {
    const sucursales = await Sucursal.find();
    res.json(sucursales);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener sucursales" });
  }
};

export const getSucursal = async (req, res) => {
  try {
    const sucursal = await Sucursal.findById(req.params.id);
    if (!sucursal) return res.status(404).json({ error: "Sucursal no encontrada" });
    res.json(sucursal);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener sucursal" });
  }
};

export const createSucursal = async (req, res) => {
  try {
    const nuevaSucursal = new Sucursal(req.body);
    await nuevaSucursal.save();
    res.status(201).json({ mensaje: "Sucursal creada", sucursal: nuevaSucursal });
  } catch (err) {
    res.status(400).json({ error: "Error al crear sucursal", detalles: err.message });
  }
};

export const updateSucursal = async (req, res) => {
  try {
    const sucursal = await Sucursal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sucursal) return res.status(404).json({ error: "Sucursal no encontrada" });
    res.json({ mensaje: "Sucursal actualizada", sucursal });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar sucursal" });
  }
};

export const deleteSucursal = async (req, res) => {
  try {
    const result = await Sucursal.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Sucursal no encontrada" });
    res.json({ mensaje: "Sucursal eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar sucursal" });
  }
};
