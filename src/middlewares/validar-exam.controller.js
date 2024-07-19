import Exam from "./exam.model.js";
import Module from '../course/course.model.js';
import { ForbiddenError } from '../errors/customErrors.js';

export const examPermissionMiddleware = async (req, res, next) => {
    try {
        const { examId } = req.params;
        const userEmail = req.user.email;
        const userRole = req.user.role;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).send("Examen no encontrado");
        }

        // Si el usuario es profesor, verifique si creó el examen
        if (userRole === 'professor') {
            if (exam.createBy !== userEmail) {
                throw new ForbiddenError('No tienes permiso para acceder a este examen');
            }
        } 
        // Si el usuario es estudiante, verifique si el examen es en alguno de sus módulos.
        else if (userRole === 'student') {
            const module = await Module.findOne({ exams: examId, students: req.user.id });
            if (!module) {
                throw new ForbiddenError('No tienes permiso para acceder a este examen');
            }
        } 
        // Si el usuario no es profesor ni estudiante, negar el acceso
        else {
            throw new ForbiddenError('Rol de usuario no autorizado');
        }

        // Si se pasan todas las comprobaciones, continúe con el siguiente middleware o controlador de ruta
        next();
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return res.status(403).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Error al verificar permisos del examen' });
    }
};