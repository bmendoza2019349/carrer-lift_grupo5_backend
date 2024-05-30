import User from "./user.model.js";
import bcryptjs from 'bcryptjs';

export const updateUser = async (req, res) => {
    const userId = req.user.uid;
    const { _id, password, username, email, ...rest } = req.body;

    try {
      if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
      }
        const user = await User.findByIdAndUpdate(userId, rest, { email, username }, { new: true });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).send("Your account has been update");

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