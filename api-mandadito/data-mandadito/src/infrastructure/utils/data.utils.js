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
<<<<<<< HEAD
    },

    /**
     * Genera un código OTP (Contraseña de un solo uso) aleatorio de 6 dígitos
     * Este código se utiliza para identificar de manera única cada orden en el sistema
     * 
     * @function generateOTP
     * @memberof dataUtils
     * @returns {string} El código OTP de 6 dígitos generado
     * 
     * @description
     * La función:
     * 1. Crea una cadena que contiene todos los dígitos posibles (0-9)
     * 2. Itera 6 veces para generar un dígito aleatorio cada vez
     * 3. Concatena los dígitos aleatorios para formar el OTP final
     * 
     * @example
     * const otp = dataUtils.generateOTP();
     * console.log(otp); // Ejemplo de salida: "847591"
     */
    generateOTP: () => {
        const digits = '0123456789';
        let OTP = '';

        // Genera 6 dígitos aleatorios
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }

        return OTP;
=======
>>>>>>> 2ab8454 (➕add : Añadiendo DeliveryApp como carpeta normal)
    }
}

module.exports = dataUtils;