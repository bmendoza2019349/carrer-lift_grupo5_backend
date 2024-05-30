import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { coursePost, coursePut, courseGet, courseDelete } from './course.controller.js';


const router = Router();

router.get("/", courseGet);

router.post(
    "/",
    [
        check("nameCourse", "The course name is required").not().isEmpty(),
        check("descripcion", "The course description is required").not().isEmpty(),
        validateFields,
        validarJWT,
    ], coursePost);



router.put(
    "/:id",
    [
        check("id", "The course ID must be a valid MongoDB format").isMongoId(),
        validateFields,
        validarJWT,
    ], coursePut);

router.delete(
    "/:id",
    [
        check("id", "The course ID must be a valid MongoDB format").isMongoId(),
        validateFields,
        validarJWT,
    ], courseDelete);

export default router;
