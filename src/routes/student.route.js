import { Router } from "express"
import studentsController from "../controllers/student.controller.js"

const router = Router()
const controller = new studentsController();

router
  .post("/", controller.createStudent)
  .get("/", controller.getAllStudents)
  .get("/:id", controller.getStudentById)
  .patch("/:id", controller.updateStudentById)
  .delete("/:id", controller.deleteStudentById)

export default router
