import User from "./user.model.js";
import bcryptjs from 'bcryptjs';

export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar si el usuario está autenticado y si es el mismo que el usuario que se está intentando actualizar
      if (req.user.uid !== id) {
        console.log(req.user.uid, id)
          return res.status(403).json({ msg: "You are not authorized to update this user" });
      }

      const { _id, password, email, ...rest } = req.body;

      if (password) {
          const salt = bcryptjs.genSaltSync();
          rest.password = bcryptjs.hashSync(password, salt);
      }
  
      await User.findByIdAndUpdate(id, rest);

        res.status(200).send(`Your account has been update`);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || req.user.uid !== id) {
      return res.status(403).send('You are not authorized to delete this user');
    }

    const user = await User.findByIdAndUpdate(id, { state: false});
    res.status(200).send('The user is successfully deleted');

  } catch (error) {
    console.error(error);
    res.status(500).send('Contact the administrator');
  }
};

export const getUserById = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}