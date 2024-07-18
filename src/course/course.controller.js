import { response, request } from "express";
import fs from 'fs';
import path from 'path';
import Course from '../course/course.model.js';
import Module from '../course/course.model.js';
import Users from "../users/user.model.js";

export const coursePost = async ( req, res ) => {
    try {
        const { nameCourse, descripcion, img } = req.body;
        const userCreator = req.user.email; // Obteniendo el email del token

        // Verificar si el usuario tiene el rol de "profesor"

        if (req.user.roleUser !== 'profesor' && req.user.roleUser !== 'superAdmin') {
            return res.status(403).send('Only professors and superAdmins can add courses');
        }

        const course = new Course( { userCreator, nameCourse, descripcion, img } );

        await course.save();

        res.status( 200 ).send( `The course was added successfully ${course}` );
    } catch ( error ) {
        console.log( error );
        res.status( 500 ).send( 'Internal Server Error course' );
    }
};

export const courseGet = async ( req, res ) => {
    try {
        const userCreator = req.user.email;

        const courses = await Course.find( { userCreator: userCreator } );

        res.status( 200 ).json( {
            courses
        } );
    } catch ( error ) {
        console.log( error );
        res.status( 500 ).send( 'Internal Server Error course' );
    }
};

// Controlador para actualizar un curso
export const coursePut = async ( req, res ) => {
    try {
        if ( !req.user || !req.user.email ) {
            return res.status( 401 ).json( { msg: "Unauthorized" } );
        }

        const { id } = req.params;
        const { email } = req.user;

        const user = await Users.findOne( { email } );
        const autorEmail = user.email;

        const course = await Course.findOne( { _id: id, userCreator: autorEmail } );

        if ( !course ) {
            return res.status( 403 ).send( 'You are not authorized to update this course' );
        }

        const { _id, ...rest } = req.body;

        await Course.findByIdAndUpdate( id, rest );

        const updatedCourse = await Course.findById( id );

        // Actualizar el curso en los usuarios asignados
        await Users.updateMany(
            { courses: id },
            { $set: { "courses.$[elem]": updatedCourse } },
            { arrayFilters: [{ "elem": id }] }
        );

        res.status( 200 ).send( `The course was successfully updated ${updatedCourse}` );
    } catch ( error ) {
        console.log( error );
        res.status( 500 ).send( 'Internal Server Error course' );
    }
};

// Controlador para eliminar un curso
export const courseDelete = async ( req, res ) => {
    try {
        const { id } = req.params;
        const userCreator = req.user.email;

        const course = await Course.findById( id );
        if ( !course ) {
            return res.status( 404 ).send( 'Course not found' );
        }

        if ( course.userCreator !== userCreator ) {
            return res.status( 403 ).send( 'You are not authorized to delete this course' );
        }

        course.status = "desactivada";
        await course.save();

        // Eliminar el curso de los usuarios asignados
        await Users.updateMany(
            { courses: id },
            { $pull: { courses: id } }
        );

        res.status( 200 ).send( 'The course was deleted correctly' );
    } catch ( error ) {
        console.log( error );
        res.status( 500 ).send( 'Internal Server Error course' );
    }
};

export const getCourseById = async ( req, res ) => {
    try {
        const { id } = req.params;

        const course = await Course.findById( id );

        if ( !course ) {
            return res.status( 404 ).send( 'Course not found' );
        }

        if ( course.status !== "activada" ) {
            return res.status( 404 ).send( 'Course state is desactived' );
        }

        res.status( 200 ).json( {
            course
        } );
    } catch ( error ) {
        console.log( error );
        res.status( 500 ).send( 'Internal Server Error course' );
    }
}

export const uploadVideo = async (req, res) => {
    try {
        const { id, moduleId } = req.params; // ID del curso y del módulo
        const files = req.files;

        // Verificar si se recibieron archivos
        if (!files || !Array.isArray(files) || files.length === 0) {
            return res.status(400).send('No video files were uploaded');
        }

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).send({ msg: 'Course not found' });
        }

        const moduleIndex = course.modulos.findIndex(module => module._id.toString() === moduleId);
        if (moduleIndex === -1) {
            return res.status(404).send({ msg: 'Module not found' });
        }

        // Agregar los nombres de los archivos al módulo
        files.forEach(file => {
            course.modulos[moduleIndex].videos.push(file.filename);
        });

        await course.save();

        res.status(200).json({ module: course.modulos[moduleIndex] });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Controlador para obtener los videos de un módulo
export const getVideos = async (req, res) => {
    try {
        const { id, moduleId } = req.params; // ID del módulo
        const course = await Course.findById( id );
        const module = course.modulos.findIndex(modules => modules._id.toString() === moduleId)

        if (module === -1) {
            return res.status(404).send({msg: 'Module not found'});
        }

        res.status(200).json({ videos: module.videos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Controlador para eliminar un video
export const deleteVideo = async (req, res) => {
    try {
        const { id, moduleId, videoName } = req.params; // ID del módulo
        const course = await Course.findById( id );
        const module = course.modulos.findIndex(modules => modules._id.toString() === moduleId)

        module.videos = module.videos.filter(video => video !== videoName);

        await module.save();

        // Eliminar el archivo físicamente
        fs.unlinkSync(path.join('uploads', videoName));

        res.status(200).send('Video deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};