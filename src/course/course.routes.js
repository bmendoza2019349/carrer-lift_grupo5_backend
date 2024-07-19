import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { coursePost, coursePut, courseGet, courseDelete, getCourseById, deleteVideo, getVideos, uploadVideo, courseGetAlumno } from './course.controller.js';
//import upload from './upload.js';


const router = Router();

router.get( "/", validarJWT, courseGet );
router.get( "/:id", check( "id", "The course id is invalid" ).isMongoId(), validateFields, getCourseById );

router.post(
    "/",
    [
        check( "nameCourse", "The course name is required" ).not().isEmpty(),
        check( "descripcion", "The course description is required" ).not().isEmpty(),
        validateFields,
        validarJWT,
    ], coursePost );



router.put(
    "/:id",
    [
        check( "id", "The course ID must be a valid MongoDB format" ).isMongoId(),
        validateFields,
        validarJWT,
    ], coursePut );

router.delete(
    "/:id",
    [
        check( "id", "The course ID must be a valid MongoDB format" ).isMongoId(),
        validateFields,
        validarJWT,
    ], courseDelete );

/*router.post(
    "/:id/modules/:moduleId",
    validarJWT,
    upload.array( 'videos', 10 ),
    uploadVideo
);*/

router.get(
    "/:id/modules/:moduleId/videos",
    validarJWT,
    getVideos
);

router.delete(
    "/:id/modules/:moduleId/videos/:videoName",
    validarJWT,
    deleteVideo
);

router.get( "/alumno", courseGetAlumno, validarJWT );

export default router;