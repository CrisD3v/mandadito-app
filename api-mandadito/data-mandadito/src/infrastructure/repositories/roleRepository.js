const { Role } = require("../../config/Db");

/**
 * roleRepository
 * @class
 * @description Clase que gestiona las operaciones de base de datos relacionadas con roles.
 * Esta clase proporciona métodos para crear, actualizar, eliminar y buscar roles.
 * @returns {roleRepository} Instancia del repositorio de roles
 * @example 
 * const roleRepository = new roleRepository();
 * const newRole = await roleRepository.create(roleData);
 */
class roleRepository {
    /**
     * Crea un nuevo rol en la base de datos
     * @param {Object} data - Datos del rol a crear
     * @returns {Promise<Object>} Promesa que resuelve con el rol creado
     */
    async create(data) {
        return await Role.create(data);
    }

    /**
     * Actualiza un rol en la base de datos
     * @param {Object} data - Datos del rol a actualizar
     * @returns {Promise<Object>} Promesa que resuelve con el rol actualizado
     */
    async update(data) {
        return await Role.update(data, { where: { id: data.role_id } });
    }

    /**
     * Elimina un rol de la base de datos por su ID
     * @param {number} role_id - ID del rol a eliminar
     * @returns {Promise<number>} Promesa que resuelve con el número de registros eliminados
     */
    async delete(role_id) {
        return await Role.destroy({ where: { id: role_id } });
    }

    /**
     * Busca un rol en la base de datos por su ID
     * @param {number} role_id - ID del rol a buscar
     * @returns {Promise<Object|null>} Promesa que resuelve con el rol encontrado o null si no existe
     */
    async findById(role_id) {
        return await Role.findByPk(role_id);
    }

    /**
     * Busca un rol en la base de datos por su nombre
     * @param {string} role - Nombre del rol a buscar
     * @returns {Promise<Object|null>} Promesa que resuelve con el rol encontrado o null si no existe
     */
    async findByName(role) {
        return await Role.findOne({ where: { role } });
    }

    /**
     * Obtiene todos los roles de la base de datos
     * @returns {Promise<Array>} Promesa que resuelve con un arreglo de roles
     */
    async findAll() {
        return await Role.findAll();
    }
}

module.exports = roleRepository;