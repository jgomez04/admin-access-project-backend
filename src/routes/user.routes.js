const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth.middleware');
const errorHandler = require('../middleware/error.middleware');

// Ruta de usuarios
router.post('/users/create', authenticateToken, authorizeAdmin, userController.createUser);
router.put('/users/update/:id', authenticateToken, authorizeAdmin, userController.updateUser);
router.get('/users', authenticateToken, authorizeAdmin, userController.getAllUsersByAdministradorId);
router.delete('/users/delete/:id', authenticateToken, authorizeAdmin, userController.deleteUser);

// Middleware para manejar errores
router.use(errorHandler);

module.exports = router;