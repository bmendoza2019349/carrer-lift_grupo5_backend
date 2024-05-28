import mongoose from 'mongoose';

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
    // modulos: [ModulosSchema],  Cambiado para que los comentarios sean objetos con las propiedades adecuadas
    img:{
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Course', CourseSchema);


