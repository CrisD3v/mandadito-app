/**
 * Clase que maneja la lógica de negocio relacionada con los roles
 */
class roleService {
    /**
     * Constructor de la clase
     * @param {Object} rolerRepository - Repositorio para el manejo de roles en la base de datos
     */
    constructor(rolerRepository) {
        this.rolerRepository = rolerRepository; // Inyectamos el repositorio de usuarios
    }

    /**
     * Crea un nuevo rol
     * @param {string} role - Nombre del rol a crear
     * @returns {Promise} Retorna el rol creado
     * @throws {Error} Si el rol ya existe
     */
    async create(role) {
        // Verificamos si el rol ya existe
        const existingRol = await this.userRepository.findByName(role);
        if (existingRol) throw new Error('El rol ya existe');

        // Creamos y retornamos el rol  
        return await this.userRepository.create(role);
    }

    /**
     * Actualiza un rol existente
     * @param {Object} data - Datos del rol a actualizar
     * @param {number} data.role_id - ID del rol
     * @param {string} data.role - Nuevo nombre del rol
     * @param {boolean} data.active - Estado del rol
     * @returns {Promise} Resultado de la actualización
     * @throws {Error} Si el rol no existe o si el nuevo nombre ya está en uso
     */
    async update(data) {
        // Obtenemos los datos del request
        const { role_id, role } = data;

        // Verificamos si el rol existe
        const existingRol = await this.userRepository.findByPk(role_id);
        if (!existingRol) throw new Error('El rol no existe');

        // Verificamos si el nombre del rol existe
        const existingRolName = await this.userRepository.findByName(role);
        if (existingRolName) throw new Error('El rol ya existe');

        // Actualizamos y retornamos el rol
        return await this.userRepository.update(data);
    }

    /**
     * Elimina un rol por su ID
     * @param {number} role_id - ID del rol a eliminar
     * @returns {Promise} Resultado de la eliminación
     */
    async delete(role_id) {
        // Verificamos si el rol existe
        const existingRol = await this.userRepository.findByPk(role_id);
        if (!existingRol) throw new Error('El rol no existe');

        // Eliminamos y retornamos el rol eliminado
        return await this.userRepository.delete(role_id);
    }

    /**
     * Busca un rol por su ID
     * @param {number} role_id - ID del rol a buscar
     * @returns {Promise} Rol encontrado
     */
    async findById(role_id) {
        // Verificamos si el rol existe
        const existingRol = await this.userRepository.findById(role_id);
        if (!existingRol) throw new Error('El rol no existe');

        // Retornamos el rol encontrado
        return await this.userRepository.findById(role_id);
    }

    /**
     * Obtiene todos los roles
     * @returns {Promise} Lista de todos los roles
     */
    async findAll() {
        // Retornamos todos los roles
        return await this.userRepository.findAll();
    }
}

module.exports = roleService;