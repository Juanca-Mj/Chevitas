import { Router } from "express";
import {
  getSucursales,
  getSucursal,
  createSucursal,
  updateSucursal,
  deleteSucursal
} from "../controllers/sucursal.controllers.js";

const router = Router();

router.get("/", getSucursales);
router.get("/:id", getSucursal);
router.post("/", createSucursal);
router.put("/:id", updateSucursal);
router.delete("/:id", deleteSucursal);

export default router;