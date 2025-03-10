const jwt = require('jsonwebtoken');
const InvalidatedTokenRepository = require('../repositories/invalidatedTokenRepository.js');
const { logError } = require('../utils/logger.js');

const invalidatedTokenRepository = new InvalidatedTokenRepository();

/**
 * Middleware de autenticación para validar tokens JWT.
 * Este middleware se encarga de verificar la validez de los tokens JWT en cada petición.
 * 
 * Funcionamiento:
 * 1. Extrae el token del header 'Authorization'
 * 2. Verifica que el token exista
 * 3. Comprueba si el token ha sido invalidado previamente
 * 4. Verifica la firma y validez del token JWT
 * 5. Si todo es correcto, añade la información del usuario decodificada a la request
 * 
 * @param {Object} req - Objeto de solicitud Express que contiene los headers y datos de la petición
 * @param {Object} res - Objeto de respuesta Express para enviar respuestas al cliente
 * @param {Function} next - Función para pasar el control al siguiente middleware
 * @returns {Object} Respuesta de error si el token no es válido o no existe
 * 
 * Códigos de error:
 * - 401: Token no proporcionado, invalidado o expirado
 * - 403: Token inválido (firma incorrecta u otros errores)
 */
 async function authMiddleware(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Obtener el token del header
    
    // Verificar si el token existe
    if (!token) {
      // Si no existe, responder con un error 
        logError(new Error('Token no proporcionado'), { 
            type: 'AUTH_ERROR', // Tipo de error
            path: req.path, // Ruta de la petición
            method: req.method, // Método de la petición
            ip: req.ip // Dirección IP del cliente
        }); // Log del error

        // Responder con un error
        return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
    }

    try {
        // Verificar si el token ha sido invalidado
        const isInvalid = await invalidatedTokenRepository.isTokenInvalid(token); 
        // Si es inválido, responder con un error
        if (isInvalid) {
            logError(new Error('Intento de uso de token invalidado'), {
                type: 'AUTH_ERROR',
                path: req.path,
                method: req.method,
                ip: req.ip,
                tokenStatus: 'invalidated'
            }); // Log del error

            // Responder con un error
            return res.status(401).json({ error: 'Token invalidado o expirado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar la firma del token
        req.user = decoded; // Añadir la información del usuario decodificada a la request
        next(); // Pasar el control al siguiente middleware
    } catch (error) {
        // Si hay un error, responder con un error
        logError(error, {
            type: 'AUTH_ERROR',
            path: req.path,
            method: req.method,
            ip: req.ip,
            errorType: error.name
        }); // Log del error

        // Responder con un error
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' }); // Si el token ha expirado, responder con un error
        }
        // Si es cualquier otro error, responder con un error
        res.status(403).json({ error: 'Token inválido' });
    }
}

module.exports = authMiddleware;