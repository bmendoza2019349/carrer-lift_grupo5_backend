import User from '../user/user.js'; 

export const validarRol = async (req, res, next) => {
    try {
        const { idUsuario } = req.body; 

        const usuario = await User.findById(idUsuario);
        
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        if (usuario.role !== "profesor" && usuario.role !== "superAdmin") {
            return res.status(403).json({ mensaje: 'No tienes permiso para acceder a esta función' });
        }

        next();
    } catch (error) {
        console.error("Error al buscar el usuario:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
