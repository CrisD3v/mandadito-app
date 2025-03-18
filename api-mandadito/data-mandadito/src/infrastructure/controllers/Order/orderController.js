const { logError } = require("../../utils/logger");
const { validationResult } = require('express-validator');

/**
 * Controlador para gestionar las órdenes
 * @typedef {Object} orderController
 */
const orderController = {
    /**
     * Crea una nueva orden en el sistema
     * @async
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} req.body - Datos de la orden
     * @param {string} req.body.title - Título de la orden
     * @param {string} req.body.description - Descripción de la orden
     * @param {string} req.body.starting_point - Punto de inicio
     * @param {string} req.body.drop_off_point - Punto de entrega
     * @param {number} req.body.price - Precio de la orden
     * @param {string} req.body.state - Estado de la orden
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Promise<void>}
     */
    createOrder: async (req, res) => {
        // Validación de los datos de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        logError('Error de validacion en el registro de ordenes', {
            errors: errors.array(),
            path: req.path,
            method: 'REGISTER'
        });

        // Extracción de datos del cuerpo de la solicitud
        const { title, description, starting_point, drop_off_point } = req.body;

        try {
            // Creación de la orden en la base de datos
            const order = await Order.create({ title, description, starting_point, drop_off_point, price, state });
            
            // Verificación de errores específicos
            if (order == 'Orden no encontrada' || order == 'Codigo no encontrado') {
                return res.status(400).json({ error: order });
            }

            // Respuesta exitosa
            res.status(201).json({ message: 'Orden creada con exito', order });
        } catch (error) {
            // Registro del error y respuesta de error
            logError('Error de validacion en el registro de ordenes', {
                errors: errors.array(),
                path: req.path,
                method: 'REGISTER'
            });
            res.status(400).json({ error: error.message });
        }
    },
}
module.exports = orderController;