import getConnection from "../db/database.js";

export const getSucursales = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.query("SELECT * FROM sucursales");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener sucursales" });
  }
};

export const getSucursal = async (req, res) => {
  try {
    const conn = await getConnection();
    const [sucursal] = await conn.query("SELECT * FROM sucursales WHERE id = ?", [req.params.id]);
    if (!sucursal) return res.status(404).json({ error: "Sucursal no encontrada" });
    res.json(sucursal);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener sucursal" });
  }
};

export const createSucursal = async (req, res) => {
  const { id, nombre, direccion, telefono, ciudad, horario } = req.body;
  if (!id || !nombre || !direccion) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  try {
    const conn = await getConnection();
    await conn.query(
      "INSERT INTO sucursales (id, nombre, direccion, telefono, ciudad, horario) VALUES (?, ?, ?, ?, ?, ?)",
      [id, nombre, direccion, telefono, ciudad, horario]
    );
    res.status(201).json({ mensaje: "Sucursal creada", sucursal: req.body });
  } catch (err) {
    res.status(500).json({ error: "Error al crear sucursal" });
  }
};

export const updateSucursal = async (req, res) => {
  const { nombre, direccion, telefono, ciudad, horario } = req.body;
  try {
    const conn = await getConnection();
    const result = await conn.query(
      "UPDATE sucursales SET nombre=?, direccion=?, telefono=?, ciudad=?, horario=? WHERE id=?",
      [nombre, direccion, telefono, ciudad, horario, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sucursal no encontrada" });
    }
    res.json({ mensaje: "Sucursal actualizada" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar sucursal" });
  }
};

export const deleteSucursal = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.query("DELETE FROM sucursales WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sucursal no encontrada" });
    }
    res.json({ mensaje: "Sucursal eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar sucursal" });
  }
};