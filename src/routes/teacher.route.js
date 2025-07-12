import { Router } from "express";
import teacherController from "../controllers/teacher.controller.js"

const controller = new teacherController();
const router = Router();

router
    .post('/',controller.createTeacher)
    .get('/',controller.getAllteachers)
    .get('/:id',controller.getTeacherById)
    .patch('/:id',controller.updateTeacherById)
    .delete('/:id',controller.deleteTeacherById)


export default router;