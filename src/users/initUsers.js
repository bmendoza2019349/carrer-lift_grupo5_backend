import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import Users from './user.model.js'

const defaultUsers = [
    {
      email: "amax@gmail.com",
      username: "Max",
      password: "123456",
      roleUser: "superAdmin",
      stateUser: true,
    },
    {
      email: "bmendoza@gmail.com",
      username: "Brandon",
      password: "123456",
      roleUser: "superAdmin",
      stateUser: true,
    },
    {
      email: "epereira@gmail.com",
      username: "Pereira",
      password: "123456",
      roleUser: "superAdmin",
      stateUser: true,
    },
    {
      email: "lvaquin@gmail.com",
      username: "Vaquin",
      password: "123456",
      roleUser: "superAdmin",
      stateUser: true,
    },
    {
      email: "eramirez@gmail.com",
      username: "Evan",
      password: "123456",
      roleUser: "superAdmin",
      stateUser: true,
    },
    {
      email: "admin@gmail.com",
      username: "admin",
      password: "123456",
      roleUser: "profesor",
      stateUser: true,
    },
    {
      email: "alumno@gmail.com",
      username: "alumno",
      password: "123456",
      roleUser: "alumno",
      stateUser: true,
    }
  ];
  
  const createDefaultUsers = async () => {
    try {
      for (const userData of defaultUsers) {
        const existingUser = await Users.findOne({ email: userData.email });
        if (!existingUser) {
          const encryptedPassword = bcryptjs.hashSync(userData.password);
          await Users.create({
            ...userData,
            password: encryptedPassword,
          });
          console.log(`User ${userData.username} created successfully.`);
        } else {
          console.log(`User ${userData.email} already exists.`);
        }
      }
    } catch (error) {
      console.error("Error creating default users:", error);
    }
  };
  
  createDefaultUsers()
    .then(() => {
      console.log("Default users setup completed.");
    })
    .catch((error) => {
      console.error("Error in default users setup:", error);
    });