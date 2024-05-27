import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    nameCourse: {
        type: String,
        required: [true, "Course name is required"]
    },
    descripcionCourse: {
        type: String,
        required: [true, "Course description is required"]
    },
    estadoCourse: {
        type: Boolean,
        default: true
    },
    modulos: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
        default: []
    }
});

export default mongoose.model('Course', CourseSchema);
