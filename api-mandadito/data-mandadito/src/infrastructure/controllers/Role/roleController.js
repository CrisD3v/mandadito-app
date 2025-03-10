const { validationResult } = require('express-validator');
const RoleService = require('../../../aplication/roleService');
const RoleRepository = require('../../repositories/roleRepository');
const { logError } = require('../../utils/logger.js');

/**
 * Instancia del servicio de roles
 * Se crea una única instancia del servicio para manejar todas las operaciones relacionadas con roles
 */
const roleService = new RoleService(new RoleRepository());

/**
 * Controlador de Roles
 * Maneja todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) relacionadas con los roles del sistema.
 * Implementa la lógica de negocio y la validación de datos para cada operación.
 * 
 * @typedef {Object} RoleController
 */
const roleController = {
    /**
     * Registra un nuevo rol en el sistema
     * 
     * @param {Object} req - Objeto de petición Express
     * @param {Object} req.body - Datos del rol a crear
     * @param {string} req.body.name - Nombre del rol
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Object} Respuesta con el estado de la operación y datos del rol creado
     * @throws {Error} Si ocurre un error durante el proceso de registro
     */
    register: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logError('Error en registro de roles', {
                error: errors.array(),
                path: req.path,
                method: 'REGISTER',
                ip: req.ip
            }); // Guardamos el error en el log
            return res.status(400).json({ errors: errors.array() });
        }
        const { name } = req.body;

        try {
            const role = await roleService.register(name);
            if (role === 'El rol ya existe') return res.status(400).json({ error: role });
            res.status(201).json({ message: 'Rol registrado', role });
        } catch (error) {
            logError('Error en registro de roles', {
                error: error.message,
                path: req.path,
                method: 'REGISTER',
                ip: req.ip
            }); // Guardamos el error en el log
            res.status(400).json({ error: error.message });
        }
    },

    /**
     * Actualiza un rol existente en el sistema
     * 
     * @param {Object} req - Objeto de petición Express
     * @param {Object} req.body - Datos del rol a actualizar
     * @param {string} req.body.name - Nuevo nombre del rol
     * @param {Object} req.params - Parámetros de la URL
     * @param {string} req.params.id - Identificador único del rol
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Object} Respuesta con el estado de la operación y datos del rol actualizado
     * @throws {Error} Si ocurre un error durante el proceso de actualización
     */
    update: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logError('Error en actualización de roles', {
                error: errors.array(),
                path: req.path,
                method: 'UPDATE',
                ip: req.ip
            }); // Guardamos el error en el log
            return res.status(400).json({ errors: errors.array() }); // Si hay errores, retornamos un mensaje de error
        }
        const { name } = req.body;
        const { id } = req.params;

        try {
            const role = await roleService.update(id, name);
            if (role === 'El rol no existe') return res.status(404).json({ error: role });
            if (role === 'El rol ya existe') return res.status(400).json({ error: role });
            res.status(200).json({ message: 'Rol actualizado', role });
        } catch (error) {
            logError('Error en actualización de roles', {
                error: error.message,
                path: req.path,
                method: 'UPDATE',
                ip: req.ip
            }); // Guardamos el error en el log
            res.status(400).json({ error: error.message }); // Si hay errores, retornamos un mensaje de error
        }
    },

    /**
     * Elimina un rol del sistema
     * 
     * @param {Object} req - Objeto de petición Express
     * @param {Object} req.params - Parámetros de la URL
     * @param {string} req.params.id - Identificador único del rol a eliminar
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Object} Respuesta con el estado de la operación
     * @throws {Error} Si ocurre un error durante el proceso de eliminación
     */
    delete: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logError('Error en eliminación de roles', {
                error: errors.array(),
                path: req.path,
                method: 'DELETE',
                ip: req.ip
            }); // Guardamos el error en el log
            return res.status(400).json({ errors: errors.array() }); // Si hay errores, retornamos un mensaje de error
        }
        const { id } = req.params;

        try {
            const role = await roleService.delete(id);
            if (role === 'El rol no existe') return res.status(404).json({ error: role });
            res.status(200).json({ message: 'Rol eliminado', role });
        } catch (error) {
            logError('Error en eliminación de roles', {
                error: error.message,
                path: req.path,
                method: 'DELETE',
                ip: req.ip
            }); // Guardamos el error en el log
            res.status(400).json({ error: error.message }); // Si hay errores, retornamos un mensaje de error
        }
    },

    /**
     * Busca un rol específico por su ID
     * 
     * @param {Object} req - Objeto de petición Express
     * @param {Object} req.params - Parámetros de la URL
     * @param {string} req.params.id - Identificador único del rol a buscar
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Object} Respuesta con el rol encontrado
     * @throws {Error} Si ocurre un error durante la búsqueda
     */
    findById: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logError('Error en búsqueda de roles', {
                error: errors.array(),
                path: req.path,
                method: 'FIND_BY_ID',
                ip: req.ip
            }); // Guardamos el error en el log
            return res.status(400).json({ errors: errors.array() }); // Si hay errores, retornamos un mensaje de error
        }
        const { id } = req.params;

        try {
            const role = await roleService.findById(id);
            if (role === 'El rol no existe') return res.status(404).json({ error: role });
            res.status(200).json({ message: 'Rol encontrado', role });
        } catch (error) {
            logError('Error en búsqueda de roles', {
                error: error.message,
                path: req.path,
                method: 'FIND_BY_ID',
                ip: req.ip
            }); // Guardamos el error en el log
            res.status(400).json({ error: error.message }); // Si hay errores, retornamos un mensaje de error
        }
    },

    /**
     * Obtiene todos los roles registrados en el sistema
     * 
     * @param {Object} req - Objeto de petición Express
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Object} Respuesta con la lista de todos los roles
     * @throws {Error} Si ocurre un error durante la consulta
     */
    findAll: async (req, res) => {
        try {
            const roles = await roleService.findAll();
            res.status(200).json({ message: 'Roles encontrados', roles });
        } catch (error) {
            logError('Error en búsqueda de roles', {
                error: error.message,
                path: req.path,
                method: 'FIND_ALL',
                ip: req.ip
            }); // Guardamos el error en el log
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = roleController;