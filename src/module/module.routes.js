import { Router } from "express";
import { check } from "express-validator";
import { postModule, getModules, putModule, deleteModule, addUrlsToModule } from "./module.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post( '/', [
    validarCampos,
    check( 'nameModule' ).notEmpty().withMessage( 'A name for this module is required' ),
    check( 'archivos' ).optional().isString().withMessage( 'Invalid file format' ),
    check( 'descriptionModule' ).notEmpty().withMessage( 'A description for this module is required' ),
], postModule );
router.get( '/', getModules );
router.put( '/:id', [
    validarCampos,
    check( 'nameModule' ).notEmpty().withMessage( 'A name for this module is required' ),
    check( 'descriptionModule' ).notEmpty().withMessage( 'A description for this module is required' ),
], putModule );
router.delete( '/:id', deleteModule );

router.patch( '/:id', [
    validarCampos,
    // check an array of urls called newUrls
    check( 'newUrls' ).isURL().withMessage( 'Invalid URL' ),
], addUrlsToModule );

export default router;