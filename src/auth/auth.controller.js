import bcryptjs from 'bcryptjs';
import Users from '../users/user.model.js';
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

    const token = await generarJWT(user.id, user.email);

    res.status(200).json({
      msg: "Login Ok!!!",
      userDetails: {
        username: user.username,
        token: token,
      },
    });
  } catch (e) {
    res.status(500).send("Comuniquese con el administrador");
  }
};