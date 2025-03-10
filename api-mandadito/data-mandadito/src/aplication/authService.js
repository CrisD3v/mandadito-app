const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const InvalidatedTokenRepository = require('../infrastructure/repositories/invalidatedTokenRepository');
const { logError } = require('../infrastructure/utils/logger');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.invalidatedTokenRepository = new InvalidatedTokenRepository();

        // Iniciar limpieza automática de tokens expirados
        this.startTokenCleanup();
    }

    /**
     * Método para registrar un nuevo usuario
     * @param {Object} data - Datos del usuario a registrar
     * @param {string} data.name - Nombre del usuario
     * @param {string} data.last_name - Apellido del usuario
     * @param {string} data.identification - Identificación del usuario
     * @param {string} data.email - Correo electrónico del usuario
     * @param {string} data.phone - Teléfono del usuario
     * @param {string} data.password - Contraseña del usuario
     * @param {number} data.role_id - ID del rol del usuario
     * @returns {Promise<Object>} Usuario creado
     * @throws {Error} Si el usuario ya existe
     */
    async register(data) {
        // Obtenemos los datos del request
        const { name, last_name, identification, email, phone, password, role_id } = data;

        // Verificamos si el usuario ya existe
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) throw new Error('El usuario ya existe');

        // hacemos hash al password para encriptar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Retornamos el usuario
        return await this.userRepository.create({ name, last_name, identification, email, phone, password: hashedPassword }, role_id);
    }

    /**
     * Método para actualizar un usuario
     * @param {Object} data - Datos del usuario a actualizar
     * @param {number} data.id - ID del usuario a actualizar
     * @param {string} data.name - Nombre del usuario
     * @param {string} data.last_name - Apellido del usuario
     * @param {string} data.identification - Identificación del usuario
     * @param {string} data.email - Correo electrónico del usuario
     * @param {string} data.phone - Teléfono del usuario
     * @param {string} data.password - Contraseña del usuario
     * @returns {Promise<Object>} Usuario actualizado
     * @throws {Error} Si el usuario no existe
     */
    async update(data) {
        // Obtenemos los datos del request
        const { id, ...datos } = data;

        // Verificamos si el usuario existe
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) throw new Error('El usuario no existe');

        // actualizamos el usuario
        const user = await this.userRepository.update(data);

        // retornamos el usuario
        return user;
    }

    /**
     * Método para iniciar sesión
     * @param {string} email - Correo electrónico del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<Object>} Token JWT de autenticación
     * @throws {Error} Si las credenciales son inválidas
     */
    async login(email, password) {
        // Verificamos si el usuario existe
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('Credenciales inválidas'); // Si no existe, lanzamos un error

        // Verificamos si la contraseña es correcta
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Credenciales inválidas'); // Si no es correcta, lanzamos un error

        // Generamos un token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' }); // El token expira en 1 hora

        // Retornamos el token
        return { token };
    }

    /**
     * Método para obtener un usuario por su ID
     * @param {number} id - ID del usuario
     * @returns {Promise<Object>} Usuario
     * @throws {Error} Si el usuario no existe
     */
    async getUserById(id) {
        // Verificamos si el usuario existe
        const user = await this.userRepository.findById(id);
        if (!user) throw new Error('El usuario no existe'); // Si no existe, lanzamos un error

        // Retornamos el usuario
        return user;
    }

    /**
 * Inicia un proceso automático de limpieza de tokens expirados
 * Se ejecuta cada hora para mantener la base de datos limpia
 * @method startTokenCleanup
 */
    startTokenCleanup() {
        // Limpiar tokens expirados cada hora
        setInterval(async () => {
            try {
                await this.invalidatedTokenRepository.removeExpiredTokens();
            } catch (error) {
                console.error('Error limpiando tokens expirados:', error);
            }
        }, 3600000); // 1 hora
    }

    /**
     * Invalida un token JWT específico
     * @method invalidateToken
     * @param {string} token - Token JWT que se desea invalidar
     * @returns {Promise<boolean>} - Retorna true si el token fue invalidado exitosamente
     * @throws {Error} - Lanza un error si el token es inválido o ya está expirado
     */
    async invalidateToken(token) {
        try {
            // Verificar que el token sea válido
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Calcular la fecha de expiración del token
            const expiresAt = new Date(decoded.exp * 1000);

            // Agregar el token a la base de datos de tokens invalidados
            await this.invalidatedTokenRepository.addToken(token, expiresAt);

            return true;
        } catch (error) {
            logError(error, {
                type: 'TOKEN_INVALIDATION_ERROR',
                method: 'invalidateToken',
                service: 'AuthService'
            });
            throw new Error('Token inválido o expirado');
        }
    }
}

module.exports = AuthService;
