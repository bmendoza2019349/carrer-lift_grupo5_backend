import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true
    },
    correctAnswer:{
        type:String,
        required: true
    },
    points:{
        type:Number,
        required: true
    }
})

const examSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },

    questions:[questionSchema],

    totalPoints: {
        type: String,
        required: true
    },

    createBy:{
        type: String,
        required: true
    }
})

export default mongoose.model( 'Exam', examSchema );