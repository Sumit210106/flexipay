import { Router } from "express";
import { SetupController } from "../controllers/SetupController";

const router = Router();
const setupController = new SetupController();

router.post("/bootstrap", setupController.bootstrap.bind(setupController));

export default router;
