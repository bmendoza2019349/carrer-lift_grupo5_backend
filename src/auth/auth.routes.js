import { Router } from "express";
import { check } from "express-validator";
import { register, login, assignCourse, getUserCourses } from "../auth/auth.controller.js";
import { validateFields } from "../middlewares/validateFields.js";
import { existEmail } from "../helpers/db-validators.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/register",
    [
        check("email", "Este no es un correo válido").isEmail(),
        check("email").custom(existEmail),
        check("username", "El username es obligatorio").not().isEmpty(),
        check("password", "El password es obligatorio").not().isEmpty(),
        check("password", "El password debe de ser mayor a 6 caracteres").isLength({
          min: 6,
        }),validateFields,
    ],
    register
);

router.post(
  "/login",
  [
    check("email", "Este no es un correo válido").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("password", "El password debe de ser mayor a 6 caracteres").isLength({
      min: 6,
    }),
    validateFields,
  ],
  login
);

router.post("/assign",
    [
        check("codigo", "Course code is required").not().isEmpty(),
        validateFields,
        validarJWT
    ],
    assignCourse
);

router.get("/mycourses", validarJWT, getUserCourses);

export default router;