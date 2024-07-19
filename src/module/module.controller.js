import { response, request } from "express";
import Course from '../course/course.model.js';

// Add a new module
export const postModule = async ( req, res ) => {
    try {
        const { id } = req.params;
        const { nameModule, descriptionModule, exams, state } = req.body;
        const userEmail = req.user.email; // Obteniendo el email del token

        const course = await Course.findById( id );

        if ( !course ) {
            return res.status( 404 ).send( 'Course not found' );
        }

        if ( course.userCreator !== userEmail ) {
            return res.status( 403 ).send( 'Only the course creator can add modules' );
        }

        const videos = req.files ? req.files.map( file => `/uploads/${file.filename}` ) : []

        const newModule = {
            nameModule,
            videos,
            descriptionModule,
            exams,
            state
        };

        course.modulos.push( newModule );

        await course.save();

        res.status( 200 ).send( 'Module added successfully' );
    } catch ( error ) {
        console.error( error );
        if ( error.name === 'ValidationError' ) {
            res.status( 500 ).send( 'Error within module validation, check every field' );
        } else {
            res.status( 500 ).send( 'Error adding the module.' );
        }
    }
};

// Get all modules
export const getModules = async ( req, res ) => {
    try {
        const { id } = req.params; // Obtener el ID del curso de los parámetros de la URL

        // Buscar el curso por ID y poblar los módulos
        const course = await Course.findById( id ).populate( {
            path: 'modulos',
            match: { state: 'habilitado' } // Filtrar módulos con estado "habilitado"
        } );

        if ( !course ) {
            return res.status( 404 ).send( 'Course not found' );
        }

        // Filtrar los módulos habilitados
        const enabledModules = course.modulos;

        res.status( 200 ).json( {
            msg: 'Modules retrieved successfully',
            modules: enabledModules
        } );
    } catch ( error ) {
        console.error( error );
        res.status( 500 ).send( 'Error retrieving modules.' );
    }
};

// Update an existing module
export const putModule = async ( req, res ) => {
    try {
        const { id, moduleId } = req.params;
        const { _id, videos, ...moduleData } = req.body;
        const userEmail = req.user.email; // Obteniendo el email del token

        const course = await Course.findById( id );

        if ( !course ) {
            return res.status( 404 ).send( 'Course not found' );
        }

        if ( course.userCreator !== userEmail ) {
            return res.status( 403 ).send( 'Only the course creator can edit modules' );
        }

        let module = course.modulos.id( moduleId );
        if ( !module ) {
            return res.status( 404 ).send( 'Module not found in this course' );
        }

        Object.assign( module, moduleData );

        await course.save();

        res.status( 200 ).send( `Module added successfully ${course}` );
    } catch ( error ) {
        console.error( error );
        if ( error.name === 'ValidationError' ) {
            res.status( 500 ).json( {
                msg: 'Error within module validation, check every field',
                error: error.message
            } );
        } else {
            res.status( 500 ).json( {
                msg: 'Error updating the module.',
                error: error.message
            } );
        }
    }
};

// Delete a module by ID
export const deleteModule = async ( req, res ) => {
    try {
        const { id, moduleId } = req.params;
        const userEmail = req.user.email; // Obteniendo el email del token

        const course = await Course.findById( id );

        if ( !course ) {
            return res.status( 404 ).send( 'Course not found' );
        }

        if ( course.userCreator !== userEmail ) {
            return res.status( 403 ).send( 'Only the course creator can delete modules' );
        }

        let module = course.modulos.id( moduleId );
        if ( !module ) {
            return res.status( 404 ).send( 'Module not found in this course' );
        }

        module.deleteOne()

        await course.save();

        res.json( {
            message: 'Module deleted',
            deletedModule: module
        } );
    } catch ( error ) {
        console.error( error );
        res.status( 500 ).json( {
            msg: 'Error deleting the module.',
            error: error.message
        } );
    }
};

export const getModuleById = async ( req, res ) => {
    try {
        const { id, moduleId } = req.params; // Obtener IDs del curso y módulo de los parámetros de la URL

        // Buscar el curso por ID
        const course = await Course.findById( id );

        if ( !course ) {
            return res.status( 404 ).send( 'Course not found' );
        }

        // Buscar el módulo dentro del curso
        const module = course.modulos.id( moduleId );

        if ( !module ) {
            return res.status( 404 ).send( 'Module not found in this course' );
        }

        res.status( 200 ).json( {
            msg: 'Module retrieved successfully',
            module
        } );
    } catch ( error ) {
        console.error( error );
        res.status( 500 ).send( 'Error retrieving the module.' );
    }
};

// Add URLs to an existing module without overwriting
export const addUrlsToModule = async ( req, res ) => {
    try {
        const { id, moduleId } = req.params;
        const { videos } = req.files;
        const userEmail = req.user.email; // Obteniendo el email del token

        const course = await Course.findById( id );

        if ( !course ) {
            return res.status( 404 ).send( 'Course not found' );
        }

        if ( course.userCreator !== userEmail ) {
            return res.status( 403 ).send( 'Only the course creator can edit modules' );
        }

        let module = course.modulos.id( moduleId );
        if ( !module ) {
            return res.status( 404 ).send( 'Module not found in this course' );
        }

        if ( !Array.isArray( videos ) ) {
            return res.status( 400 ).send( 'Formato invalido' );
        }

        // Add new URLs without overwriting existing ones
        module.videos = module.videos.concat( videos.filter( url => module.videos.indexOf( url ) === -1 ) );

        await course.save();

        res.status( 200 ).send( `URLs added successfully to module: ${module.nameModule}` );
    } catch ( error ) {
        console.error( error );
        if ( error.name === 'ValidationError' ) {
            res.status( 500 ).json( {
                msg: 'Error within module validation, check every field',
                error: error.message
            } );
        } else {
            res.status( 500 ).json( {
                msg: 'Error updating the module.',
                error: error.message
            } );
        }
    }
}

// Edit module url on specific index
export const editUrlModule = async ( req, res ) => {
    try {
        const { id, moduleId } = req.params;
        const { url, index } = req.body;
        const userEmail = req.user.email; // Obteniendo el email del token

        const course = await Course.findById( id );

        if ( !course ) {
            return res.status( 404 ).send( 'Course not found' );
        }

        if ( course.userCreator !== userEmail ) {
            return res.status( 403 ).send( 'Only the course creator can edit modules' );
        }

        let module = course.modulos.id( moduleId );
        if ( !module ) {
            return res.status( 404 ).send( 'Module not found in this course' );
        }

        if ( index < 0 || index >= module.archivos.length ) {
            return res.status( 400 ).send( 'Invalid index' );
        }

        //edit the url if, by editing it, the new url is not a duplicate of an existent url
        if ( module.archivos.indexOf( url ) !== -1 ) {
            return res.status( 400 ).send( 'The new URL is already in the module' );
        }

        module.archivos[index] = url;

        await course.save();

        res.status( 200 ).send( `URL edited successfully in module: ${module.nameModule}` );
    } catch ( error ) {
        console.error( error );
        if ( error.name === 'ValidationError' ) {
            res.status( 500 ).json( {
                msg: 'Error within module validation, check every field',
                error: error.message
            } );
        } else {
            res.status( 500 ).json( {
                msg: 'Error updating the module.',
                error: error.message
            } );
        }
    }
}
