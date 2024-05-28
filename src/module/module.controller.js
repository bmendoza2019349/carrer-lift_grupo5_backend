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
        const modules = await Module.find().populate( 'form' );

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
        const { _id, ...moduleData } = req.body;

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



