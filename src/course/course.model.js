import mongoose from 'mongoose';

// Función para generar un código aleatorio de 6 caracteres
const generateRandomCode = () => {
    return Math.random().toString( 36 ).substring( 2, 8 ).toUpperCase();
};

const moduleSchema = new mongoose.Schema( {
    nameModule: {
        type: String,
        required: [true, 'A name for this module is required'],
        unique: true,
        sparse: true,
        default: null
    },
    videos: [{
        type: String,
    }],
    descriptionModule: {
        type: String,
        required: [true, 'A description for this module is required'],
    },
    exams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam'
    }],
    state: {
        type: String,
        enum: ["habilitado", "deshabilitado", "enActivacion"],
        default: "habilitado"
    }


} );


const CourseSchema = new mongoose.Schema( {
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

    modulos: [moduleSchema],

    codigo: {
        type: String,
        unique: true
    },

    img: {
        type: String
    },
    status: {
        type: String,
        default: "activada",
        enum: ["activada", "desactivada", "enActivacion"]
    }
} );

// Middleware para generar el código antes de guardar el curso
CourseSchema.pre( 'save', function ( next ) {
    if ( this.isNew ) { // Solo generar el código si el documento es nuevo
        this.codigo = generateRandomCode();
    }
    next();
} );

CourseSchema.index( { "modulos.nameModule": 1 }, { unique: true, sparse: true } );

export default mongoose.model( 'Course', CourseSchema );