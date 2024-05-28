import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields.js';
import { coursePost, coursePut, courseGet, courseDelete } from './course.controller.js'; 
// import { validarRol } from '../middlewares/rol-validator.js';

const router = Router();

router.get("/", courseGet);

router.post(
    "/",
    [
        check("userCreator", "The course creator is required").not().isEmpty(),
        check("nameCourse", "The course name is required").not().isEmpty(),
        check("descripcion", "The course description is required").not().isEmpty(),
        validateFields,
        // validarRol
    ], coursePost);

router.put(
    "/:id",
    [
        check("id", "The course ID must be a valid MongoDB format").isMongoId(),
        check("userCreator", "The course creator is required").not().isEmpty(),
        check("nameCourse", "The course name is required").not().isEmpty(),
        check("descripcion", "The course description is required").not().isEmpty(),
        validateFields,
        // validarRol
    ], coursePut);

router.delete(
    "/:id",
    [
        check("id", "The course ID must be a valid MongoDB format").isMongoId(),
        validateFields,
        // validarRol
    ], courseDelete);

export default router;
