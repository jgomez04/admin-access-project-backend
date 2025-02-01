const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const ROLES = require('../utils/constants');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');

router.post('/projects/create', authenticateToken, checkRole([ROLES.ADMIN]), projectController.createProject);
router.put('/projects/update',  authenticateToken, checkRole([ROLES.ADMIN]), projectController.updateProject);
router.delete('/projects/delete/:id',  authenticateToken, checkRole([ROLES.ADMIN]), projectController.deleteProject);
router.get('/projects',  authenticateToken, checkRole([ROLES.ADMIN, ROLES.USER]), projectController.getAllProjects);
router.get('/projects/:id',  authenticateToken, checkRole([ROLES.ADMIN, ROLES.USER]), projectController.getProjectById);

router.post('/projects/associate', authenticateToken, checkRole([ROLES.ADMIN]), projectController.assignUsersToProject);
router.delete('/projects/disassociate', authenticateToken, checkRole([ROLES.ADMIN]), projectController.removeUserFromProject);

module.exports = router;