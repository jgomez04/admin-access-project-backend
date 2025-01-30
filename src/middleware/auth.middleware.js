const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, no se proporcionó un token' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido' });
        }
        req.user = user;
        next();
    });
};

const authorizeAdmin = (req, res, next) => {
    const { rol_id } = req.user;

    if (rol_id !== 1) {
        return res.status(403).json({ message: 'Acceso denegado, se requiere rol de administrador' });
    }

    next();
};

module.exports = { authenticateToken, authorizeAdmin };