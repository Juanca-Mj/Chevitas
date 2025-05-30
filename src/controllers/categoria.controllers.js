import getConnection from "../db/database.js";

const getCategorias = async (req, res) => {
    try{
    const connection = await getConnection();
    const result = await connection.query("SELECT id, nombre, descripcion FROM categorias");
    res.json(result);
   } catch (error) {
       res.status(500).json({ error: "Error en la consulta" });
   }
};

export const methodHTTP = {
    getCategorias
};