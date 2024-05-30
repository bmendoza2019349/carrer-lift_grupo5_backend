import { response, request } from "express";
import Course from '../course/course.model.js';
import Users from "../users/user.model.js";

export const coursePost = async (req, res) => {
    try {
        const { nameCourse, descripcion, img } = req.body;
        const userCreator = req.user.email; // Obteniendo el email del token
        const userRole = req.user.roleUser; // Obteniendo el rol del usuario del token

        // Verificar si el usuario tiene el rol de "profesor"
        
        if (userRole !== 'profesor' ) {
            return res.status(403).send('Only professors can add courses');
        }else if (userRole !== 'superAdmin'){
            return res.status(403).send('Only superAdmin can add courses');
        }

        const course = new Course({ userCreator, nameCourse, descripcion, img });

        await course.save();

        res.status(200).send(`The course was added successfully ${course}`);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error course');
    }
};

export const courseGet = async (req, res) => {
    try {
        const userCreator = req.user.email;

        const courses = await Course.find(userCreator);

        res.status(200).json({
            courses
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error course');
    }
};

// Controlador para actualizar un curso
export const coursePut = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const { id } = req.params;
        const { email } = req.user;

        const user = await Users.findOne({ email });
        const autorEmail = user.email;

        const course = await Course.findOne({ _id: id, userCreator: autorEmail });

        if (!course) {
            return res.status(403).send('You are not authorized to update this course');
        }

        const { _id, ...rest } = req.body;

        await Course.findByIdAndUpdate(id, rest);

        const updatedCourse = await Course.findById(id);

        // Actualizar el curso en los usuarios asignados
        await Users.updateMany(
            { courses: id },
            { $set: { "courses.$[elem]": updatedCourse } },
            { arrayFilters: [{ "elem": id }] }
        );

        res.status(200).send(`The course was successfully updated ${updatedCourse}`);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error course');
    }
};

// Controlador para eliminar un curso
export const courseDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const userCreator = req.user.email;

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).send('Course not found');
        }

        if (course.userCreator !== userCreator) {
            return res.status(403).send('You are not authorized to delete this course');
        }

        course.status = "desactivada";
        await course.save();

        // Eliminar el curso de los usuarios asignados
        await Users.updateMany(
            { courses: id },
            { $pull: { courses: id } }
        );

        res.status(200).send('The course was deleted correctly');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error course');
    }
};