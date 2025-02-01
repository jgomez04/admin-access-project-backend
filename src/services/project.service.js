const Project = require('../models/project.model');
const User = require('../models/user.model');
const UserProject = require('../models/userProject.model');
const ROLES = require('../utils/constants');

exports.createProject = async (data) => {
    try {
        const projectExist = await Project.findOne({ where: { nombre: data.nombre } });
        if (projectExist) {
            throw new Error('El proyecto ya existe');
        }

        const newProject = await Project.create(data);
        return newProject;
    } catch (err) {
        throw new Error(`Error al crear el proyecto: ${err.message}`);
    }
};

exports.getAllProjects = async () => {
    try {
        const projects = await Project.findAll({
            include: [
                {
                    model: User,
                    as: 'administrador',
                    attributes: ['id', 'nombre']
                },
                {
                    model: User,
                    as: 'usuarios',
                    attributes: ['id', 'nombre', 'email'], 
                    through: { attributes: [] }
                }
            ],
            
        });
        return projects;
    } catch (err) {
        throw new Error(`Error al obtener los proyectos: ${err.message}`);
    }
};

exports.getProjectsByUserId = async (userId) => {
    try {
        const projects = await Project.findAll({
            where: {
                '$usuarios.id$': userId // Filtra los proyectos donde el usuario con id=userId está asignado
            },
            include: [
                {
                    model: User,
                    as: 'usuarios', // Relación de usuarios en el proyecto
                    attributes: ['id', 'nombre', 'email'],
                    through: { attributes: [] } // Asegura que no se incluyan atributos de la tabla intermedia
                },
                {
                    model: User,
                    as: 'administrador', // Si también quieres obtener el administrador del proyecto
                    attributes: ['id', 'nombre']
                }
            ],
        });
        return projects;
    } catch (err) {
        throw new Error(`Error al obtener los proyectos para el usuario: ${err.message}`);
    }
};

exports.assignUsersToProject = async (data) => {
    const project = await Project.findByPk(data.projectId);
    if (!project) throw new Error('Proyecto no encontrado');

    const users = await User.findAll({ where: { id: data.userIds } });
    if (users.length !== data.userIds.length) throw new Error('Algunos usuarios no fueron encontrados');

    await project.addUsuarios(users);
    return await Project.findByPk(data.projectId, {
        include: [
            {
                model: User,
                as: 'usuarios',
                attributes: ['id', 'nombre', 'email'], 
                through: { attributes: [] }
            }
        ],
    });
};

exports.removeUserFromProject = async (data) => {
    const project = await Project.findByPk(data.projectId);
    if (!project) throw new Error('Proyecto no encontrado');

    const user = await User.findByPk(data.userId);
    if (!user) throw new Error('Usuario no encontrado');

    await project.removeUsuario(user);
};

exports.updateProject = async (data) => {
    try {
        const project = await Project.findByPk(data.id);
        if (!project) throw new Error('Proyecto no encontrado');

        // Actualizar el proyecto
        await project.update({
            nombre: data.nombre,
            descripcion: data.descripcion,
            administrador_id: data.administrador_id
        });

        return project;
    } catch (err) {
        throw new Error(`Error al actualizar el proyecto: ${err.message}`);
    } 
};

exports.deleteProject = async (id) => {
    try {
        const project = await Project.findByPk(id);
        if (!project) throw new Error('Proyecto no encontrado');
        await project.destroy();
    } catch (err) {
        throw new Error(`Error al eliminar el proyecto: ${err.message}`);
    }
};

exports.getProjectById = async (id, userId) => {
    try {
        const user = await User.findByPk(userId);
        if (user.rol_id !== ROLES.ADMIN) {
            // Verificar si el usuario está asignado al proyecto
            const userProject = await UserProject.findOne({
                where: {
                    proyecto_id: id,
                    usuario_id: userId
                }
            });

            if (!userProject) {
                throw new Error('Acceso denegado: No estás asignado a este proyecto');
            }
        }
        
        const project = await Project.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'administrador',
                    attributes: ['id', 'nombre']
                },
                {
                    model: User,
                    as: 'usuarios',
                    attributes: ['id', 'nombre', 'email'], 
                    through: { attributes: [] }
                }
            ],
        });
        if (!project) throw new Error('Proyecto no encontrado');
        return project;
    } catch (err) {
        throw new Error(`Error al obtener el proyecto: ${err.message}`);
    }
};

