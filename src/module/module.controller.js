import { response, request } from "express";
import Module from './module.model.js';
// Add a new module
export const postModule = async ( req, res ) => {
    try {
        const { _id, ...moduleData } = req.body;

        const newModule = new Module( {
            _id,
            ...moduleData
        } );

        const savedModule = await newModule.save();

        res.json( {
            message: 'Module Created',
            savedModule
        } );
    } catch ( error ) {
        console.error( error );
        if ( error.name === 'ValidationError' ) {
            res.status( 500 ).json( {
                msg: 'Error within module validation, check every field',
                error: error.message
            } );
        } else {
            res.status( 500 ).json( {
                msg: 'Error adding the module.',
                error: error.message
            } );
        }
    }
};

// Get all modules
export const getModules = async ( req, res ) => {
    try {
        const modules = await Module.find()

        res.status( 200 ).json( modules );
    } catch ( error ) {
        console.error( error );
        res.status( 500 ).json( {
            msg: 'Error retrieving modules.',
            error: error.message
        } );
    }
};

// Update an existing module
export const putModule = async ( req, res ) => {
    try {
        const moduleId = req.params.id;
        const { _id, archivos, ...moduleData } = req.body;

        let module = await Module.findById( moduleId );

        if ( !module ) {
            return res.status( 404 ).json( { msg: 'Module not found.' } );
        }

        module.set( {
            _id: moduleId,
            ...moduleData
        } );

        const updatedModule = await module.save();

        res.json( {
            message: 'Module updated',
            updatedModule
        } );
    } catch ( error ) {
        console.error( error );
        if ( error.name === 'ValidationError' ) {
            res.status( 500 ).json( {
                // Display the error message and a text with the parameters that trigger such error
                msg: 'Error within module validation, check every field',
                error: error.message,
                // Display the parameters that trigger the error
                parameters: error.errors
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
        const moduleId = req.params.id;

        const deletedModule = await Module.findByIdAndDelete( moduleId );

        if ( !deletedModule ) {
            return res.status( 404 ).json( { msg: `Module with the ID ${moduleId} could not be found.` } );
        }

        res.json( {
            message: 'Module deleted',
            deletedModule
        } );
    } catch ( error ) {
        console.error( error );
        res.status( 500 ).json( {
            msg: 'Error deleting the module.',
            error: error.message
        } );
    }
};

// Add URLs to an existing module without overwriting
export const addUrlsToModule = async ( req, res ) => {
    try {
        const moduleId = req.params.id;
        const { newUrls } = req.body; // Assume the new URLs are sent in an array called 'newUrls'

        // Find the module by ID
        let module = await Module.findById( moduleId );

        // Check if the module was found
        if ( !module ) {
            return res.status( 404 ).json( { msg: 'Module not found.' } );
        }

        // Validate the new URLs
        const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
        const invalidUrls = newUrls.filter( url => !urlRegex.test( url ) );

        if ( invalidUrls.length > 0 ) {
            return res.status( 400 ).json( { msg: 'Invalid URL detected.', invalidUrls } );
        }

        // Append the new URLs to the existing 'archivos' array
        module.archivos.push( ...newUrls );

        // Save the updated module
        const updatedModule = await module.save();

        // Respond with the updated module
        res.status( 201 ).json( {
            message: 'URLs added to the module',
            updatedModule
        } );
    } catch ( error ) {
        console.error( error );
        res.status( 500 ).json( {
            msg: 'Error adding URLs to the module.',
            error: error.message
        } );
    }
}

export const updateSpecificIndex = async ( req, res ) => {
    try {
        const moduleId = req.params.id;
        const { index, newUrl } = req.body;
        let module = await Module.findById( moduleId );

        if ( !module ) {
            return res.status( 404 ).json( { msg: 'Module not found.' } );
        }

        // Validate the new URL
        const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
        if ( !urlRegex.test( newUrl ) ) {
            return res.status( 400 ).json( { msg: `Invalid URL detected: ${newUrl}` } );
        }

        // Update the URL at the specified index
        module.archivos[index] = newUrl;

        // Save the updated module
        const updatedModule = await module.save();

        // Respond with the updated module
        res.status( 201 ).json( {
            message: 'URL updated in the module',
            updatedModule
        } );
    } catch ( error ) {
        console.error( error );
        res.status( 500 ).json( {
            msg: 'Error updating the URL in the module.',
            error: error.message
        } );
    }
}





