const User = require('../models/user.model'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (nombre, email, password, rol_id, administrador_id) => {
    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            throw new Error('El usuario ya existe');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const newUser = await User.create({
            nombre,
            email,
            password: hashedPassword,
            rol_id,
            administrador_id
        });

        return newUser;
    } catch (err) {
        throw new Error(`Error al crear el usuario: ${err.message}`);
    }
};

exports.updateUser = async (id, nombre, email, rol_id, administrador_id, admin_from_token) => {
    try {
        // Buscar el usuario por ID
        const user = await User.findByPk(id);
        if (user.administrador_id !== admin_from_token) {
            throw new Error('Acceso denegado, este usuario no esta bajo su administración');
        }

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar si el email está siendo modificado
        if (email && email !== user.email) {
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                throw new Error('El email ya está en uso');
            }
        }

        // Actualizar el usuario
        await user.update({
            nombre,
            email,
            rol_id,
            administrador_id
        });

        return user;
    } catch (err) {
        throw new Error(`Error al actualizar el usuario: ${err.message}`);
    }
};

exports.getAllUsersByAdministradorId = async (administrador_id) => {
    try {
        const users = await User.findAll({ where: { administrador_id } });
        return users;
    } catch (err) {
        throw new Error(`Error al obtener los usuarios: ${err.message}`);
    }
}

exports.deleteUser = async (id, admin_from_token) => {
    try {
        // Buscar el usuario por ID
        const user = await User.findByPk(id);
        if (user.administrador_id !== admin_from_token) {
            throw new Error('Acceso denegado, este usuario no esta bajo su administración');
        }

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        await user.destroy();
        return { message: 'Usuario eliminado con éxito' };
    } catch (err) {
        throw new Error(`Error al eliminar el usuario: ${err.message}`);
    }
};

