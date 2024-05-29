import Course from '../course/course.model.js';
import { response } from 'express';

export const coursePost = async (req, res) => {
    try {
        const {nameCourse, descripcion, img } = req.body;

        userCreator = req.user.email
        const course = new Course({ userCreator, nameCourse, descripcion, img });
        
        await course.save();

        res.status(200).json({
            msg: 'The course was added successfully',
            course
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const courseGet = async (req, res) => {
    try {
        const courses = await Course.find({ status: true }); 
        res.status(200).json({
            courses
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const coursePut = async (req, res) => {
    try {
        const { id } = req.params;
        const { userCreator, nameCourse, descripcion, img } = req.body;

        const existingCourse = await Course.findById(id);
        if (!existingCourse) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        existingCourse.userCreator = userCreator;
        existingCourse.nameCourse = nameCourse;
        existingCourse.descripcion = descripcion;
        existingCourse.img = img;

        await existingCourse.save();

        res.status(200).json({
            msg: 'The course was successfully updated',
            course: existingCourse
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const courseDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        course.status = false;
        await course.save();

        res.status(200).json({ msg: 'The course was deleted correctly', deletedCourse: course });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};