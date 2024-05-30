import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { deleteUser, updateUser } from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
const routerUser = Router();

routerUser.put(
    '/update',
    [
        check("email", "This is not a valid email").isEmail(),
        check("username", "The username is required").not().isEmpty(),
        check("password", "The password is mandatory").not().isEmpty(),
        check("password", "The password must be greater than 6 characters").isLength({
            min: 6,
        }),
        validarJWT,
        validarCampos
    ],
    updateUser
);

routerUser.delete(
    '/delete/:id',
    [
        check("id", "It is not a valid ID").isMongoId(),
        validarJWT,
        validarCampos
    ],
    deleteUser
);

export default routerUser;