import { Router } from "express";
import groupController from "../controllers/group.controller.js";
const controller = new groupController();
const router = Router();

router
    .post('/',controller.createGroup)
    .get('/',controller.getAllGroups)
    .get('/:id',controller.getGroupById)
    .patch('/:id',controller.updateGroupById)
    .delete('/:id',controller.deleteGroupById)


export default router;