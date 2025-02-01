const projectService = require('../services/project.service');
const ROLES = require('../utils/constants');


exports.createProject = async (req, res) => {
    try {
        const newProject = await projectService.createProject(req.body);
        res.status(201).json({ message: 'Proyecto creado con éxito', project: newProject });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const { rol_id, id: userId } = req.user;
        let projects;
        if (rol_id === ROLES.ADMIN) {
            projects = await projectService.getAllProjects();
        } else if (rol_id === ROLES.USER) {
            projects = await projectService.getProjectsByUserId(userId);
        }

        res.status(200).json({ message: 'Proyectos consultados con éxito', projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignUsersToProject = async (req, res) => {
    try {
        const project = await projectService.assignUsersToProject(req.body);
        res.status(200).json({ message: 'Usuarios asignados con éxito', project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.removeUserFromProject = async (req, res) => {
    try {
        await projectService.removeUserFromProject(req.body);
        res.status(200).json({ message: 'Usuarios desasignados con éxito'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await projectService.updateProject(req.body);
        res.status(200).json({ message: 'Proyecto actualizado con éxito', project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await projectService.deleteProject(req.params.id);
        res.status(200).json({ message: 'Proyecto eliminado con éxito'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await projectService.getProjectById(req.params.id, req.user.id);
        res.status(200).json({ message: 'Proyecto consultado con éxito', project});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};