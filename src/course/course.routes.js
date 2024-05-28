import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import { coursePost } from './course.controller.js'; 
import { validarRol } from '../middlewares/rol-validator.js';

const router = Router();

router.post(
    "/",
    [
        check("userCreator", "El creador del curso es obligatorio").not().isEmpty(),
        check("nameCourse", "El nombre del curso es obligatorio").not().isEmpty(),
        check("descripcion", "La descripción del curso es obligatoria").not().isEmpty(),
        validateFields,
        validarRol
    ], coursePost);

export default router;
