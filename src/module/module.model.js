import mongoose from 'mongoose'
import Exam from '../Form/exam.model.js';

const moduleSchema = new mongoose.Schema( {
    nameModule: {
        type: String,
        required: [true, 'A name for this module is required'],
        unique: true,
    },

    archivos: [{
        type: String,
        validate: {
            validator: function ( val ) {
                const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
                return urlRegex.test( val );
            },
            message: 'Invalid URL'
        }
    }],
    descriptionModule: {
        type: String,
        required: [true, 'A description for this module is required'],
    },
    exams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam'
    }]


} );


export default mongoose.model( 'Module', moduleSchema )