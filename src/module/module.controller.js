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

        res.status(200).send(`The module was added successfully`);
    } catch ( error ) {
        console.error( error );
        if ( error.name === 'ValidationError' ) {
            res.status( 500 ).send( 'Error within module validation, check every field');
        } else {
            res.status( 500 ).send( 'Error adding the module.');
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
        res.status( 500 ).send( 'Error retrieving modules.');
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
        const moduleId = req.params.id;

        const deletedModule = await Module.findByIdAndDelete( moduleId );

        if ( !deletedModule ) {
            return res.status( 404 ).json( { msg: 'Module not found.' } );
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





