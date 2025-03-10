// Importamos el servidor Express configurado
const server = require("./src/config/App");
// Importamos la conexión a la base de datos
const { conn } = require("./src/config/Db");
// Importamos los seeders
const seedRoles = require("./src/infrastructure/seeders/rolesSeeder");

/**
 * Middleware Global para Manejo de Errores
 * Captura cualquier error no manejado en la aplicación y envía una respuesta
 * estructurada al cliente.
 * 
 * @param {Error} error - El objeto de error capturado
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para pasar al siguiente middleware
 */
server.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

/**
 * Inicialización del Servidor
 * Inicia el servidor Express en el puerto configurado y establece
 * la conexión con la base de datos.
 */
server.listen(server.get("port"), () => {
  console.log("server is running on port " + server.get("port"));
});

/**
 * Sincronización de la Base de Datos
 * Realiza la sincronización de los modelos con la base de datos y
 * ejecuta los seeders iniciales.
 * 
 * @param {Object} options - Opciones de sincronización
 * @param {boolean} options.force - Si es false, preserva las tablas existentes
 */
conn.sync({ force: false }).then(async () => {
  console.log("db is conect");

  try {
    await seedRoles(); // Se ejecuta solo si no hay roles
    console.log("✅ Seeders ejecutados correctamente");
  } catch (error) {
    console.error("❌ Error ejecutando seeders:", error);
  }
});