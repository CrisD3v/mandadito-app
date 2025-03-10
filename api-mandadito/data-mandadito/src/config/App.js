const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const server = express();
const path = require("path");

/**
 * Configuración de middlewares:
 * - bodyParser.json(): Permite procesar datos JSON en las peticiones
 * - bodyParser.urlencoded(): Procesa datos de formularios
 * - cors(): Habilita Cross-Origin Resource Sharing
 * - morgan("dev"): Registra logs de las peticiones HTTP en modo desarrollo
 * - express.json(): Middleware para parsear JSON
 * - express.urlencoded(): Procesa datos codificados en la URL
 */
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());
server.set("port", process.env.PORT || 3000);
server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

/**
 * Importación de las rutas de autenticación desde el módulo principal
 */
const { authRoutes, roleRoutes } = require("../infrastructure/routes/main")

/**
 * Definición de rutas:
 * - /auth: Maneja todas las rutas relacionadas con la autenticación de usuarios
 */
server.use("/auth", authRoutes);
server.use("/role", roleRoutes);

/**
 * Ruta de prueba:
 * Endpoint básico para verificar que la API está funcionando
 */
server.get("/", (req, res) => {
    res.send("API is running...");
});
module.exports = server;