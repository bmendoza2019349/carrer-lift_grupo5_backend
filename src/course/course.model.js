import mongoose from 'mongoose';
import Module from '../module/module.model.js';

const CourseSchema = new mongoose.Schema({
    userCreator: {
        type: String,
        required: [true, "user Creator is required"]
    },
    nameCourse: {
        type: String,
        required: [true, "Course name is required"]
    },
    descripcion: {
        type: String,
        required: [true, "Course description is required"]
    },

    modulos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }],

    img:{
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Course', CourseSchema);


