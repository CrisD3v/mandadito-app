const { validationResult } = require('express-validator');
/**
 * Utilidades para el manejo y validación de datos
 * @namespace dataUtils
 */
const dataUtils = {
    /**
     * Middleware para validar campos utilizando express-validator
     * @function validateFields
     * @param {Array} validations - Array de validaciones a ejecutar
     * @returns {Function} Middleware de Express
     * 
     * @description
     * Esta función crea un middleware que:
     * 1. Ejecuta secuencialmente las validaciones proporcionadas
     * 2. Verifica si hay errores de validación
     * 3. Retorna un error 400 si encuentra problemas, o continúa con el siguiente middleware
     * 
     * @example
     * router.post('/ruta', validateFields([
     *   check('email').isEmail(),
     *   check('password').isLength({ min: 6 })
     * ]), controlador);
     */
    validateFields: (validations) => {
        return async (req, res, next) => {
            // Ejecutar cada validación proporcionada
            for (let validation of validations) {
                const result = await validation.run(req);
                if (!result.isEmpty()) break;
            }

            // Verificar si hay errores después de ejecutar las validaciones
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            next(); // Continuar con el siguiente middleware si no hay errores
        };
    }
}

module.exports = dataUtils;