import { Router } from "express";
import { check } from "express-validator";
import { postModule, getModules, putModule, deleteModule } from "./module.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post( '/', [
    validarCampos,
    check( 'nameModule' ).notEmpty().withMessage( 'A name for this module is required' ),
    check( 'archivos.*' ).optional().isString().withMessage( 'Invalid file format' ),
    check( 'descriptionModule' ).notEmpty().withMessage( 'A description for this module is required' ),
    check( 'form.*' ).optional().isMongoId().withMessage( 'Invalid form ID' )
], postModule );
router.get( '/', getModules );
router.put( '/:id', putModule );
router.delete( '/:id', deleteModule );