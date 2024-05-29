import { Router } from "express";
import { check } from "express-validator";
import { postModule, getModules, putModule, deleteModule, addUrlsToModule, updateSpecificIndex } from "./module.controller.js";
import { validateFields } from "../middlewares/validateFields.js";

const router = Router();

router.post( '/', [
    validateFields,
    check( 'nameModule' ).notEmpty().withMessage( 'A name for this module is required' ),
    check( 'archivos' ).optional().isString().withMessage( 'Invalid file format' ),
    check( 'descriptionModule' ).notEmpty().withMessage( 'A description for this module is required' ),
], postModule );

router.get( '/', getModules );

router.put( '/:id', [
    validateFields,
    check( 'nameModule' ).notEmpty().withMessage( 'A name for this module is required' ),
    check( 'descriptionModule' ).notEmpty().withMessage( 'A description for this module is required' ),
], putModule );
router.delete( '/:id', deleteModule );

router.patch( '/:id', [
    validateFields,
    // check an array of urls called newUrls
    check( 'newUrls' ).isURL().withMessage( 'Invalid URL' ),
], addUrlsToModule );

router.patch( '/newIndex/:id', [
    validateFields,
    check( 'index' ).isNumeric().withMessage( 'Invalid index' ),
], updateSpecificIndex );

export default router;