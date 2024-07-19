import Exam from "./exam.model.js";
import Module from '../course/course.model.js';

export const examPermissionMiddleware = async (req, res, next) => {
    try {
        const { examId } = req.params;
        const userEmail = req.user.email;
        const userRole = req.user.role;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Examen no encontrado" });
        }

        // Si el usuario es un profesor, verifica si creó el examen
        if (userRole === 'professor') {
            if (exam.createBy !== userEmail) {
                return res.status(403).json({ message: 'No tienes permiso para acceder a este examen' });
            }
        } 
        // Si el usuario es un estudiante, verifica si el examen está en uno de sus módulos
        else if (userRole === 'student') {
            const module = await Module.findOne({ exams: examId, students: req.user.id });
            if (!module) {
                return res.status(403).json({ message: 'No tienes permiso para acceder a este examen' });
            }
        } 
        // Si el usuario no es ni profesor ni estudiante, deniega el acceso
        else {
            return res.status(403).json({ message: 'Rol de usuario no autorizado' });
        }

        // Si todas las verificaciones pasan, procede al siguiente middleware o manejador de ruta
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error al verificar permisos del examen' });
    }
};