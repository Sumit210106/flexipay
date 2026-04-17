import { Router } from "express";
import { InvoiceController } from "../controllers/InvoiceController";

const router = Router();
const invoiceController = new InvoiceController();

router.get("/", invoiceController.listBySubscription.bind(invoiceController));
router.get("/:id", invoiceController.getById.bind(invoiceController));

export default router;
