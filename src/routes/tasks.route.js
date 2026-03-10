import { Router } from "express";
import taskController from "../controllers/task.controller.js";

const router = Router();

router.get("/", taskController.getTasks).post("/", taskController.create);
router.route('/:id')
  .get(taskController.findTaskById)
  .put(taskController.updateTask)
    .delete(taskController.deleteTask)
    .patch(taskController.done);

export default router;