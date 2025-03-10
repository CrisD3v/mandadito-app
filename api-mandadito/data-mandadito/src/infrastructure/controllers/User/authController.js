const { validationResult } = require('express-validator');
const AuthService = require('../../../aplication/authService');
const UserRepository = require('../../repositories/userRepository');
const { logError } = require('../../utils/logger');


/**
 * Instancia del servicio de usuarios
 * Se crea una única instancia del servicio para manejar todas las operaciones relacionadas con usuarios
 */
const authService = new AuthService(new UserRepository());

/**
 * Controlador de autenticación de usuarios
 * Este controlador maneja todas las operaciones relacionadas con la autenticación,
 * incluyendo el registro de nuevos usuarios y el inicio de sesión.
 * 
 * @typedef {Object} AuthController
 * @property {function} register - Maneja el proceso de registro de nuevos usuarios en el sistema
 * @property {function} login - Gestiona la autenticación de usuarios existentes
 * @property {function} validateFields - Realiza la validación de campos del formulario
 * @returns {AuthController} Objeto controlador con métodos de autenticación
 */
const authController = {
    /**
     * Registro de usuario
     * Procesa la solicitud de registro de un nuevo usuario en el sistema.
     * Valida los datos de entrada y crea un nuevo registro en la base de datos.
     * 
     * @param {Object} req - Objeto de petición que contiene los datos del usuario
     * @param {Object} req.body - Datos del formulario de registro
     * @param {string} req.body.name - Nombre del usuario
     * @param {string} req.body.last_name - Apellido del usuario
     * @param {string} req.body.identification - Número de identificación
     * @param {string} req.body.email - Correo electrónico
     * @param {string} req.body.phone - Telefono del usuario
     * @param {string} req.body.password - Contraseña
     * @param {number} req.body.role_id - ID del rol asignado
     * @param {Object} res - Objeto de respuesta HTTP
     * @returns {Object} Respuesta con el estado del registro y datos del usuario
     * @throws {Error} Si hay un error en el registro del usuario
     */
    register: async (req, res) => {
        // validamos los campos
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() }); // si hay errores, retornamos un error
        logError('Error de validación en el registro de usuario', {
            errors: errors.array(),
            path: req.path,
            method: 'REGISTER'
        }); // registramos el error en el log
        const { name, last_name, identification, email, phone, password, role_id } = req.body; // obtenemos los datos del body
        
        try {
            // registramos al usuario
            const user = await authService.register({name, last_name, identification, email, phone, password, role_id});
            if (user === 'El rol no se encontro') return res.status(400).json({ error: user }); // si el rol no se encontro, retornamos un error
            res.status(201).json({ message: 'Usuario registrado', user }); // si todo sale bien, retornamos el usuario
        } catch (error) {
            // si hay un error, lo registramos en el log
            logError('Error en el registro de usuario', {
                error: error.message,
                path: req.path,
                method: 'REGISTER'
            }); 
            res.status(400).json({ error: error.message }); // si hay un error, retornamos el error
        }
    },

    /**
     * Actualización de usuario
     * Procesa la solicitud de actualización de un usuario en el sistema.
     * Valida los datos de entrada y actualiza el registro en la base de datos.
     *
     * @param {Object} req - Objeto de petición que contiene los datos del usuario
     * @param {Object} req.body - Datos del formulario de registro
     * @param {number} req.body.id - ID del usuario
     * @param {string} req.body.name - Nombre del usuario
     * @param {string} req.body.last_name - Apellido del usuario
     * @param {string} req.body.identification - Número de identificación
     * @param {string} req.body.email - Correo electrónico
     * @param {string} req.body.phone - Telefono del usuario
     * @param {string} req.body.password - Contraseña
     * @param {Object} res - Objeto de respuesta HTTP
     * @returns {Object} Respuesta con el estado de la actualización y datos del usuario
     * @throws {Error} Si hay un error en la actualización del usuario
     */
    update: async (req, res) => {
        // validamos los campos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // registramos el error en el log
            logError('Error de validación en actualización de usuario', { 
                errors: errors.array(),
                path: req.path,
                method: 'UPDATE'
            });
            return res.status(400).json({ errors: errors.array() }); // si hay errores, retornamos un error
        }
        const {name, last_name, identification, email, phone, password } = req.body; // obtenemos los datos del body
        const {id} = req.params; // obtenemos el id del usuario

        try {
            const user = await authService.update({ id, name, last_name, identification, email, phone, password}); // actualizamos al usuario
            if (user === 'El usuario no existe') return res.status(400).json({ error: user }); // si el usuario no existe, retornamos un error
            res.status(200).json({ message: 'Usuario actualizado', user }); // si todo sale bien, retornamos el usuario
        } catch (error) {
            logError('Error en actualización de usuario', {
                error: error.message,
                userId: id,
                path: req.path,
                method: 'UPDATE',
                userData: { name, email }
            }); // si hay un error, lo registramos en el log
            res.status(400).json({ error: error.message }); // si hay un error, retornamos el error
        }
    },

    /**
     * Obtener usuario por id
     * Procesa la solicitud de obtener un usuario por id en el sistema.
     * Valida los datos de entrada y obtiene el registro en la base de datos.
     *
     * @param {Object} req - Objeto de petición que contiene los datos del usuario
     * @param {Object} req.params - Datos del formulario de registro
     * @param {number} req.params.id - ID del usuario
     * @param {Object} res - Objeto de respuesta HTTP
     * @returns {Object} Respuesta con el estado de la actualización y datos del usuario
     * @throws {Error} Si hay un error en la actualización del usuario
     */
    me: async (req, res) => {
        // validamos los campos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // registramos el error en el log
            logError('Error de validación en consulta de usuario', {
                errors: errors.array(),
                path: req.path,
                method: 'GET'
            });
            return res.status(400).json({ errors: errors.array() }); // si hay errores, retornamos un error
        }
        const {id} = req.params; // obtenemos el id del usuario
        try {
            const user = await authService.getUserById(id); // obtenemos al usuario
            res.status(200).json({ message: 'Usuario encontrado', user }); // si todo sale bien, retornamos el usuario
        } catch (error) {
            logError('Error en consulta de usuario', {
                error: error.message,
                userId: id,
                path: req.path,
                method: 'GET'
            }); // si hay un error, lo registramos en el log
            res.status(400).json({ error: error.message }); // si hay un error, retornamos el error
        }
    },

    /**
     * Login de usuario
     * Procesa la solicitud de inicio de sesión verificando las credenciales
     * proporcionadas y genera un token de autenticación si son válidas.
     * 
     * @param {Object} req - Objeto de petición HTTP
     * @param {Object} req.body - Datos del formulario de login
     * @param {string} req.body.email - Correo electrónico del usuario
     * @param {string} req.body.password - Contraseña del usuario
     * @param {Object} res - Objeto de respuesta HTTP
     * @returns {Object} Respuesta con el token de autenticación si el login es exitoso
     */
    login: async (req, res) => {
        // validamos los campos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // registramos el error en el log
            logError('Error de validación en login', {
                errors: errors.array(),
                path: req.path,
                method: 'LOGIN'
            });
            return res.status(400).json({ errors: errors.array() }); // si hay errores, retornamos un error
        }
        const { email, password } = req.body; // obtenemos los datos del body

        try {
            const { token } = await authService.login(email, password); // iniciamos sesion
            res.status(200).json({ message: 'Login exitoso', token }); // si todo sale bien, retornamos el token
        } catch (error) {
            // si hay un error, lo registramos en el log
            logError('Error en login de usuario', {
                error: error.message,
                email,
                path: req.path,
                method: 'LOGIN'
            });
            res.status(400).json({ error: error.message }); // si hay un error, retornamos el error
        }
    },

    /**
     * Cierre de sesión de usuario
     * Invalida el token de autenticación actual y finaliza la sesión del usuario.
     * 
     * @param {Object} req - Objeto de petición HTTP
     * @param {Object} req.headers - Cabeceras de la petición
     * @param {string} req.headers.authorization - Token de autorización
     * @param {Object} res - Objeto de respuesta HTTP
     * @returns {Object} Respuesta confirmando el cierre de sesión
     */
    logout: async (req, res) => {
        try {
            // Obtener el token del header de autorización
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                // Si no hay token, retornar un error
                logError('Intento de logout sin token', {
                    path: req.path,
                    method: 'LOGOUT',
                    ip: req.ip
                });
                return res.status(401).json({ error: 'No hay token de autorización' });
            }

            // Invalidar el token añadiéndolo a una lista negra o expirandolo
            // Puedes implementar esto usando Redis o una tabla en la base de datos
            await authService.invalidateToken(token);

            res.status(200).json({ 
                message: 'Sesión cerrada exitosamente',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            // registramos el error en el log
            logError('Error en logout de usuario', {
                error: error.message,
                path: req.path,
                method: 'LOGOUT',
                ip: req.ip
            });
            res.status(500).json({ error: error.message }); // si hay un error, retornamos el error
        }
    },
}

module.exports = authController;