import { Router } from "express";
import { PlanController } from "../controllers/PlanController";
import { tenantContext } from "../middlewares/tenantContext";

const router = Router();
const planController = new PlanController();

router.use(tenantContext);

router.post("/", planController.create.bind(planController));
router.get("/", planController.listByOrg.bind(planController));
router.get("/:id", planController.getById.bind(planController));
router.patch("/:id", planController.update.bind(planController));
router.delete("/:id", planController.delete.bind(planController));

export default router;
