/**
 * Módulo de logging para la aplicación
 * 
 * Este módulo utiliza Winston para manejar los logs de la aplicación.
 * Proporciona funcionalidades para registrar errores y mensajes en archivos
 * y en la consola durante el desarrollo.
 */

const winston = require('winston'); // Importamos Winston
const path = require('path'); // Importamos path

/**
 * Configuración principal del logger
 * - Nivel de log: info
 * - Formato: incluye timestamp, stack de errores y formato JSON
 * - Meta datos por defecto: identifica el servicio como 'api-mandadito'
 * - Transportes: 
 *   1. Archivo para errores (error.log)
 *   2. Archivo para todos los logs (combined.log)
 */
const logger = winston.createLogger({ // Configuración principal del logger
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ), // Formato JSON
    defaultMeta: { service: 'api-mandadito' }, // Metadatos por defecto
    transports: [ // Transportes
        new winston.transports.File({ 
            filename: path.join(__dirname, '../../../logs/error.log'), 
            level: 'error' 
        }), // Archivo para errores
        new winston.transports.File({ 
            filename: path.join(__dirname, '../../../logs/combined.log') 
        }) // Archivo para todos los logs
    ]
});

/**
 * Configuración adicional para entorno de desarrollo
 * Agrega un transporte de consola con formato coloreado
 * cuando no estamos en producción
 */
if (process.env.NODE_ENV !== 'production') { // Si no estamos en producción
    logger.add(new winston.transports.Console({ // Agregamos un transporte de consola
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    })); // Formato simple
}

/**
 * Función auxiliar para registrar errores
 * @param {Error} error - El objeto de error a registrar
 * @param {Object} context - Contexto adicional opcional para el error
 * 
 * Registra errores con información detallada incluyendo:
 * - Mensaje del error
 * - Stack trace
 * - Código de error
 * - Timestamp
 * - Contexto adicional proporcionado
 */
const logError = (error, context = {}) => { // Función para registrar errores
    // Información adicional del error
    const errorInfo = {
        message: error.message,
        stack: error.stack,
        code: error.code,
        timestamp: new Date().toISOString(),
        ...context
    };

    logger.error('Error occurred:', errorInfo); // Registramos el error
};

module.exports = {
    logger,
    logError
};