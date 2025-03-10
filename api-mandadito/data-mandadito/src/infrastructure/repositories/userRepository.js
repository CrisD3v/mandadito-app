const { User, Role } = require("../../config/Db");

/**
 * UserRepository
 * @class
 * @description Clase que gestiona las operaciones de base de datos relacionadas con usuarios.
 * Esta clase proporciona métodos para crear usuarios y asignarles roles, así como
 * realizar búsquedas de usuarios por correo electrónico.
 * @returns {UserRepository} Instancia del repositorio de usuarios
 * @example 
 * const userRepository = new UserRepository();
 * const newUser = await userRepository.create(userData, roleId);
 */
class UserRepository {
    /**
     * Crea un nuevo usuario en la base de datos y le asigna un rol específico
     * @param {Object} userData - Objeto que contiene la información del usuario
     * @param {string} userData.name - Nombre del usuario
     * @param {string} userData.last_name - Apellido del usuario
     * @param {string} userData.identification - Identificación del usuario
     * @param {string} userData.email - Correo electrónico del usuario
     * @param {string} userData.phone - Telefono del usuario
     * @param {string} userData.password - Contraseña del usuario (debe estar hasheada)
     * @param {number} role_id - Identificador único del rol que se asignará al usuario
     * @returns {Promise<Object>} Promesa que resuelve con el usuario creado
     * @throws {Error} Si hay un error en la creación del usuario o asignación del rolv
     */
    async create(userData, role_id) {
        // creamos el usuario
        const user = await User.create(userData); // Insertamos los datos

        // buscamos el rol por id y lo asignamos al usuario
        const role = await Role.findByPk(role_id); // Obtener el rol de la base de datos

        if (role) await user.setRole(role); // Asignar el rol al usuario
        else return ("El rol no se encontro") // Manejar el caso en que el rol no se encuentre

        // retornamos el usuario
        return user
    }

    /**
     * Actualiza un usuario en la base de datos
     * @param {Object} userData - Objeto que contiene la información del usuario
     * @param {number} userData.id - Identificador único del usuario
     * @param {string} userData.name - Nombre del usuario
     * @param {string} userData.last_name - Apellido del usuario
     * @param {string} userData.identification - Identificación del usuario
     * @param {string} userData.email - Correo electrónico del usuario
     * @param {string} userData.phone - Telefono del usuario
     * @param {string} userData.password - Contraseña del usuario (debe estar hasheada)
     * @returns {Promise<Object>} Promesa que resuelve con el usuario actualizado
     * @throws {Error} Si hay un error en la actualización del usuario
     */
    async update(userData) {
        // otenemos el id del usuario y los datos a actualizar
        const { id, ...data } = userData;

        // actualizamos el usuario
        const user = await User.update(data, { where: { id } });

        // retornamos el usuario
        return user;
    }

    /**
     * Busca un usuario en la base de datos por su correo electrónico
     * @param {string} email - Correo electrónico del usuario a buscar
     * @returns {Promise<Object|null>} Promesa que resuelve con el usuario encontrado o null si no existe
     * @throws {Error} Si hay un error en la búsqueda del usuario
     */
    async findByEmail(email) {
        // buscamos el usuario por email
        return await User.findOne({ where: { email } });
    }

    /**
     * Busca un usuario en la base de datos por su id
     * @param {number} id - Identificador único del usuario a buscar
     * @returns {Promise<Object|null>} Promesa que resuelve con el usuario encontrado o null si no existe
     * @throws {Error} Si hay un error en la búsqueda del usuario
     */
    async findById(id){
        // buscamos el usuario por id
        return await User.findByPk(id);
    }
}

module.exports = UserRepository;