import { response, request } from "express";
import Course from '../course/course.model.js';

// Add a new module
export const postModule = async (req, res) => {
    try {
        const { id } = req.params;
        const { nameModule, archivos, descriptionModule, exams, state } = req.body;
        const userEmail = req.user.email; // Obteniendo el email del token

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).send('Course not found');
        }

        if (course.userCreator !== userEmail) {
            return res.status(403).send('Only the course creator can add modules');
        }

        const newModule = {
            nameModule,
            archivos,
            descriptionModule,
            exams,
            state
        };

        course.modulos.push(newModule);

        await course.save();

        res.status(200).send('Module added successfully');
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            res.status(500).send('Error within module validation, check every field');
        } else {
            res.status(500).send('Error adding the module.');
        }
    }
};

// Get all modules
export const getModules = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del curso de los parámetros de la URL

        // Buscar el curso por ID y poblar los módulos
        const course = await Course.findById(id).populate({
            path: 'modulos',
            match: { state: 'habilitado' } // Filtrar módulos con estado "habilitado"
        });

        if (!course) {
            return res.status(404).send('Course not found');
        }

        // Filtrar los módulos habilitados
        const enabledModules = course.modulos;

        res.status(200).json({
            msg: 'Modules retrieved successfully',
            modules: enabledModules
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving modules.');
    }
};

// Update an existing module
export const putModule = async (req, res) => {
    try {
        const { id, moduleId } = req.params;
        const { _id, archivos, ...moduleData } = req.body;
        const userEmail = req.user.email; // Obteniendo el email del token

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).send('Course not found');
        }

        if (course.userCreator !== userEmail) {
            return res.status(403).send('Only the course creator can edit modules');
        }

        let module = course.modulos.id(moduleId);
        if (!module) {
            return res.status(404).send('Module not found in this course');
        }

        Object.assign(module, moduleData);

        await course.save();

        res.status(200).send(`Module added successfully ${course}`);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            res.status(500).json({
                msg: 'Error within module validation, check every field',
                error: error.message
            });
        } else {
            res.status(500).json({
                msg: 'Error updating the module.',
                error: error.message
            });
        }
    }
};

// Delete a module by ID
export const deleteModule = async (req, res) => {
    try {
        const { id, moduleId } = req.params;
        const userEmail = req.user.email; // Obteniendo el email del token

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).send('Course not found');
        }

        if (course.userCreator !== userEmail) {
            return res.status(403).send('Only the course creator can delete modules');
        }

        let module = course.modulos.id(moduleId);
        if (!module) {
            return res.status(404).send('Module not found in this course');
        }

        module.remove();

        await course.save();

        res.json({
            message: 'Module deleted',
            deletedModule: module
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error deleting the module.',
            error: error.message
        });
    }
};

// // Add URLs to an existing module without overwriting
// export const addUrlsToModule = async ( req, res ) => {
//     try {
//         const moduleId = req.params.id;
//         const { newUrls } = req.body; // Assume the new URLs are sent in an array called 'newUrls'

//         // Find the module by ID
//         let module = await Module.findById( moduleId );

//         // Check if the module was found
//         if ( !module ) {
//             return res.status( 404 ).json( { msg: 'Module not found.' } );
//         }

//         // Validate the new URLs
//         const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
//         const invalidUrls = newUrls.filter( url => !urlRegex.test( url ) );

//         if ( invalidUrls.length > 0 ) {
//             return res.status( 400 ).json( { msg: 'Invalid URL detected.', invalidUrls } );
//         }

//         // Append the new URLs to the existing 'archivos' array
//         module.archivos.push( ...newUrls );

//         // Save the updated module
//         const updatedModule = await module.save();

//         // Respond with the updated module
//         res.status( 201 ).json( {
//             message: 'URLs added to the module',
//             updatedModule
//         } );
//     } catch ( error ) {
//         console.error( error );
//         res.status( 500 ).json( {
//             msg: 'Error adding URLs to the module.',
//             error: error.message
//         } );
//     }
// }





