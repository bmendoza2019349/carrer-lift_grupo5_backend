import { Router } from "express";
import { check } from "express-validator";
import { postModule, getModules, putModule, deleteModule, getModuleById } from "./module.controller.js";
import { validateFields } from "../middlewares/validateFields.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/:id/module",
    [
        check("nameModule", "The course name is required").not().isEmpty(),
        check("descriptionModule", "The course description is required").not().isEmpty(),
        validateFields,
        validarJWT,
    ], postModule);

router.get('/module', getModules);

router.put('/:id', [
    validateFields,
    check('nameModule').notEmpty().withMessage('A name for this module is required'),
    check('descriptionModule').notEmpty().withMessage('A description for this module is required'),
], putModule);

router.delete('/:id', deleteModule);

router.get('/courses/:id/modules/:moduleId', getModuleById);

// router.patch('/:id', [
//     validateFields,
//     // check an array of urls called newUrls
//     check('newUrls').isURL().withMessage('Invalid URL'),
// ], addUrlsToModule);

export default router;