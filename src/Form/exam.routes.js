import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validateFields } from "../middlewares/validateFields.js";
import { createExam, submitResponse, getStudentResponses } from "./exam.controller.js";

const router = Router();

router.post(
    '/createExam/:id',
    [
        validateFields,
        validarJWT
    ], createExam );
router.post( '/submitexam', validarJWT, validateFields, submitResponse );
router.get( '/responsexam', validarJWT, validateFields, getStudentResponses );

export default router;