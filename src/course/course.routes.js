import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import { coursePost, coursePut, courseGet } from './course.controller.js'; 
// import { validarRol } from '../middlewares/rol-validator.js';

const router = Router();

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

router.get("/", courseGet);

export default router;
