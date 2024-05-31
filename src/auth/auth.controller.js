import bcryptjs from 'bcryptjs';
import Users from '../users/user.model.js';
import Course from '../course/course.model.js';
import { generarJWT } from '../helpers/generate-JWT.js';

export const register = async (req, res) => {
    try {
      const { email, username, password, roleUser } = req.body;
      const encryptedPassword = bcryptjs.hashSync(password);
  
      const user = await Users.create({
        username,
        email: email.toLowerCase(),
        password: encryptedPassword,
        roleUser,
      });
  
      return res.status(200).json({
        msg: "|-- user has been added to database --|",
        userDetails: {
          user: user.username,
          password: user.password,
          email: user.email,
          roleUser
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send("Failed to register user");
    }
  };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res
        .status(400)
        .send(`Wrong credentials, ${email} doesn't exists en database`);
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).send("wrong password");
    }

    const token = await generarJWT(user.id, user.email, user.roleUser,user.username);

    res.status(200).json({
      msg: "Login Ok!!!",
      userDetails: {
        username: user.username,
        roleUser: user.roleUser,
        token: token,
      },
    });
  } catch (e) {
    res.status(500).send("Comuniquese con el administrador");
  }
};

export const assignCourse = async (req, res) => {
  try {
      const { codigo } = req.body;
      const userEmail = req.user.email; // Obteniendo el email del token
      const userRole = req.user.roleUser; // Obteniendo el rol del usuario del token

      // Verificar si el usuario tiene el rol de "alumno" o "superAdmin"
      if (userRole !== 'alumno' && userRole !== 'superAdmin') {
          return res.status(403).send('Only students or superAdmins can assign courses');
      }

      // Buscar el curso por código
      const course = await Course.findOne({ codigo });
      if (!course) {
          return res.status(404).send('Course not found');
      }

      // Buscar el usuario por email
      const user = await Users.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Verificar si el curso ya está asignado al usuario
      if (user.courses.includes(course._id)) {
          return res.status(400).send('Course already assigned');
      }

      // Asignar el curso al usuario
      user.courses.push(course._id);
      await user.save();

      res.status(200).send('Course assigned successfully');
  } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
  }
};

// Nuevo controlador para obtener los cursos asignados a un usuario
export const getUserCourses = async (req, res) => {
  try {
      const userEmail = req.user.email; // Obteniendo el email del token

      // Buscar el usuario por email y poblar los cursos con el estado activado
      const user = await Users.findOne({ email: userEmail }).populate({
          path: 'courses',
          match: { status: 'activada' } // Filtrar cursos por estado activado
      });

      if (!user) {
          return res.status(404).send('User not found');
      }

      res.status(200).json({
          msg: 'Courses retrieved successfully',
          courses: user.courses
      });
  } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
  }
};