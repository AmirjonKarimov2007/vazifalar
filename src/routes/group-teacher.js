import { Router } from "express"
import controller from "../controllers/group-teachers.controller.js"

const router = Router()

router
  .post('/', controller.createGroupTeacher)
  .get('/', controller.getAllGroupTeachers)
  .patch('/:id', controller.updateGroupTeacher)
  .delete('/:id', controller.deleteGroupTeacher)

export default router
