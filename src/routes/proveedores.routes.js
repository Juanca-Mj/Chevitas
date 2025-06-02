import { Router } from "express";
import {
  getProveedores,
  getProveedor,
  createProveedor,
  updateProveedor,
  deleteProveedor
} from "../controllers/proveedor.controllers.js";

const router = Router();

router.get("/", getProveedores);
router.get("/:id", getProveedor);
router.post("/", createProveedor);
router.put("/:id", updateProveedor);
router.delete("/:id", deleteProveedor);

export default router;