import Exam from "./exam.model.js";
import Response from './response.model.js';
import User from "../users/user.model.js";
import Module from '../course/course.model.js';
import { professorAuth } from '../middleware/professorAuth.js';

export const createExam = [professorAuth, async (req, res) => {
    try {
        const { id } = req.params
        const { title, questions, totalPoints } = req.body;
        const userEmail = req.user.email;

        const exam = new Exam({
            title,
            questions: questions.map(q => ({
                text: q.text,
                correctAnswer: q.correctAnswer,
                points: q.points
            })),
            totalPoints,
            createBy: userEmail,
        });

        await exam.save();

        // Añadir el examen al módulo
        const module = await Module.findById(id);
        if (!module) {
            return res.status(404).send("Módulo no encontrado");
        }

        module.exams.push(exam._id);
        await module.save();

        return res
            .status(200)
            .send(`El examen se creó con éxito`);
    } catch (e) {
        return res
            .status(500)
            .send(`Error al crear el examen: ${e}`);
    }
}];

export const submitResponse = async (req, res) => {
    try {
        const { examId, answers } = req.body;
        const studentId = req.user.id;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).send("Examen no encontrado");
        }

        let totalObtainedPoints = 0;
        const processedAnswers = answers.map(answer => {
            const question = exam.questions.id(answer.questionId);
            const obtainedPoints = question.correctAnswer === answer.answer ? question.points : 0;
            totalObtainedPoints += obtainedPoints;
            return {
                question: answer.questionId,
                answer: answer.answer,
                obtainedPoints,
            };
        });

        const response = new Response({
            exam: examId,
            student: studentId,
            answers: processedAnswers,
            totalObtainedPoints,
        });

        await response.save();
        res.status(201).json({ msg: "Respuesta enviada con éxito", response });
    } catch (e) {
        res.status(500).send("Error al enviar la respuesta");
    }
};

export const getStudentResponses = async (req, res) => {
    try {
        const studentId = req.user.id;
        const responses = await Response.find({ student: studentId }).populate('exam').populate('answers.question');
        res.status(200).json(responses);
    } catch (e) {
        res.status(500).send("Error al recuperar las respuestas");
    }
};