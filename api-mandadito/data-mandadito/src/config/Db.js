/**
 * Importación de módulos necesarios:
 * - dotenv: Carga variables de entorno desde un archivo .env
 * - Sequelize: ORM para interactuar con la base de datos
 * - path: Utilidad para manejar rutas de archivos
 * - fs: Sistema de archivos para leer directorios
 */
require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");

/**
 * Obtención de variables de entorno para la conexión a la base de datos
 */
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME , DB_PORT} = process.env;

/**
 * Creación de la instancia de Sequelize
 * Se configura la conexión a PostgreSQL usando las variables de entorno
 * logging: false - Desactiva los logs de consultas SQL
 */
const sequelize = new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    { logging: false }
);

/**
 * Obtención del nombre del archivo actual para excluirlo de la carga de modelos
 */
const basename = path.basename(__filename);

/**
 * Array que almacenará los modelos definidos en la aplicación
 */
const modelDefiners = [];

/**
 * Lectura automática de archivos de modelos
 * - Lee todos los archivos .js en el directorio domain
 * - Filtra archivos ocultos y el archivo actual
 * - Carga cada modelo en el array modelDefiners
 */
fs.readdirSync(path.join(__dirname, "../domain"))
    .filter(
        (file) =>
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    )
    .forEach((file) => {
        const model = require(path.join(__dirname, "../domain", file));
        modelDefiners.push(model);
    });

/**
 * Inicialización de modelos
 * Cada modelo se inicializa con la instancia de Sequelize
 */
modelDefiners.forEach((model) => model(sequelize));

/**
 * Capitalización de nombres de modelos
 * Asegura que todos los nombres de modelos comiencen con mayúscula
 */
const entries = Object.entries(sequelize.models);
const capsEntries = entries.map((entry) => [
    entry[0][0].toUpperCase() + entry[0].slice(1),
    entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

/**
 * Desestructuración de modelos para uso directo
 */
const { User, Role, InvalidatedToken } = sequelize.models;

/**
 * Definición de relaciones entre modelos (comentado actualmente)
 * Aquí se definirían las relaciones entre las diferentes tablas
 */
// Users.belongsTo(Rol);
// Users.hasMany(Orders);
// Orders.belongsTo(Users);
// Cart.belongsTo(Users);
// Categories.belongsToMany(SubCategories, { through: "c_s" });
// SubCategories.belongsToMany(Categories, { through: "c_s" });
// Products.hasMany(SubCategories);
// Products.belongsTo(Categories);

/**
 * Exportación de modelos y conexión
 * Permite acceder a los modelos y la conexión desde otros archivos
 */
module.exports = {
    ...sequelize.models,
    conn: sequelize,
};