import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Exam.questions',
                required: true
            },
            answer: {
                type: String,
                required: true
            },
            obtainedPoints: {
                type: Number,
                required: true
            },
        },
    ],
    totalObtainedPoints: { 
        type: Number, 
        required: true 
    },
});

export default mongoose.model('Response', responseSchema);