const { Order, CodeOrder } = require("../../config/Db");
const dataUtils = require("../utils/data.utils");

/**
 * Repositorio para manejar las operaciones de órdenes en la base de datos.
 * Este repositorio proporciona métodos para crear y actualizar órdenes,
 * incluyendo la generación y gestión de códigos OTP asociados.
 */
class OrderRepository {
    /**
     * Crea una nueva orden en la base de datos junto con su código OTP asociado
     * @param {Object} orderData - Objeto con los datos de la orden a crear
     *                            Debe contener la información necesaria para crear una orden válida
     * @returns {Promise<Order>} Promesa que resuelve con la orden creada
     * @throws {Error} Si hay algún problema al crear la orden o el código OTP
     */
    async create(orderData) {
        // Crear la orden
        const order = await Order.create(orderData);

        // Generar código OTP y crear entrada en la tabla CodeOrder
        const otp = dataUtils.generateOTP();
        const codeOrder = await CodeOrder.create({ code: otp });

        // Asociar el código OTP con la orden
        await order.setCodeOrder(codeOrder);

        return order;
    }

    /**
     * Actualiza el estado de una orden existente y genera un nuevo código OTP
     * @param {Object} orderData - Objeto con los datos de la orden a actualizar
     *                            Debe contener id y codeOrderId
     * @param {string} state - Nuevo estado que se asignará a la orden
     * @returns {Promise<Order>} Promesa que resuelve con la orden actualizada
     * @throws {Error} Si la orden o el código no se encuentran en la base de datos
     */
    async updateOrderState(orderData) {
        // Buscar la orden y el código OTP asociado
        const order = await Order.findByPk(orderData.id);
        const codeOrder = findByPk(orderData.codeOrderId);

        // Generar nuevo código OTP
        const otp = dataUtils.generateOTP();

        // Verificar si la orden y el código OTP existen
        if (!order) {
            throw new Error("Orden no encontrada");
        }
        if (!codeOrder) {
            throw new Error("Codigo no encontrado");
        }

        // Actualizar el estado de la orden y generar nuevo código OTP
        order.state = orderData.state;
        codeOrder.code = otp;
        
        // Guardar los cambios en la base de datos
        await codeOrder.save();
        await order.save();

        // Retornar la orden actualizada
        return order;
    }
}
module.exports = OrderRepository;