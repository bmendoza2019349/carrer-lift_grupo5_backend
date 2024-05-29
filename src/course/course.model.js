import mongoose from 'mongoose';
import Module from '../module/module.model.js';

// Función para generar un código aleatorio de 6 caracteres
const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

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

    codigo: {
        type: String,
        unique: true
    },

    img:{
        type: String
    },
    status: {
        type: String,
        default: "activada",
        enum:["activada", "desactivada", "enActivacion"]
    }
});

// Middleware para generar el código antes de guardar el curso
CourseSchema.pre('save', function (next) {
    if (this.isNew) { // Solo generar el código si el documento es nuevo
        this.codigo = generateRandomCode();
    }
    next();
});

export default mongoose.model('Course', CourseSchema);


