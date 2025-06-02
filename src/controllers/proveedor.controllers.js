import getConnection from "../db/database.js";

export const getProveedores = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.query("SELECT * FROM proveedores");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener proveedores" });
  }
};

export const getProveedor = async (req, res) => {
  try {
    const conn = await getConnection();
    const [proveedor] = await conn.query("SELECT * FROM proveedores WHERE id = ?", [req.params.id]);
    if (!proveedor) return res.status(404).json({ error: "Proveedor no encontrado" });
    res.json(proveedor);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener proveedor" });
  }
};

export const createProveedor = async (req, res) => {
  const { id, nombre, contacto, telefono, email, direccion } = req.body;
  if (!id || !nombre) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  try {
    const conn = await getConnection();
    await conn.query(
      "INSERT INTO proveedores (id, nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?, ?)",
      [id, nombre, contacto, telefono, email, direccion]
    );
    res.status(201).json({ mensaje: "Proveedor creado", proveedor: req.body });
  } catch (err) {
    res.status(500).json({ error: "Error al crear proveedor" });
  }
};

export const updateProveedor = async (req, res) => {
  const { nombre, contacto, telefono, email, direccion } = req.body;
  try {
    const conn = await getConnection();
    const result = await conn.query(
      "UPDATE proveedores SET nombre=?, contacto=?, telefono=?, email=?, direccion=? WHERE id=?",
      [nombre, contacto, telefono, email, direccion, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json({ mensaje: "Proveedor actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar proveedor" });
  }
};

export const deleteProveedor = async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.query("DELETE FROM proveedores WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json({ mensaje: "Proveedor eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar proveedor" });
  }
};