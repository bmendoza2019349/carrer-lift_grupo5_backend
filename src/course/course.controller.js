import Course from '../course/course.model.js';
import { response } from 'express';

export const coursePost = async (req, res) => {
    try {
        const { userCreator, nameCourse, descripcion, img } = req.body;
        const course = new Course({ userCreator, nameCourse, descripcion, img });
        
        await course.save();

        res.status(200).json({
            msg: 'El curso se agregó correctamente',
            course
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};


