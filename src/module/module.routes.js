import { Router } from "express";
import { check } from "express-validator";
import { postModule, getModules, putModule, deleteModule, getModuleById, addUrlsToModule, editUrlModule } from "./module.controller.js";
import { validateFields } from "../middlewares/validateFields.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/:id",
    [
        check( "nameModule", "The course name is required" ).not().isEmpty(),
        check( "descriptionModule", "The course description is required" ).not().isEmpty(),
        validateFields,
        validarJWT,
    ], postModule );

router.get( '/module/:id', getModules );

router.put( '/moduleEdit/:id/:moduleId', [
    validarJWT,
    validateFields,
    check( 'nameModule' ).notEmpty().withMessage( 'A name for this module is required' ),
    check( 'descriptionModule' ).notEmpty().withMessage( 'A description for this module is required' ),
], putModule );

router.delete( '/:id/:moduleId', [validarJWT], deleteModule );

router.get( '/courses/:id/modules/:moduleId', getModuleById );


router.patch(
    '/editUrl/:id/:moduleId',
    [
        validarJWT,
        validateFields,
        check( 'url' ).isURL().withMessage( 'Invalid URL' ),
        check( 'index' ).isNumeric().withMessage( 'Invalid index' ),
    ],
    editUrlModule
);

router.patch(
    '/:courseId/module/:moduleId/urls',
    [
        validarJWT,
        validateFields,
    ],
    addUrlsToModule
);


export default router;