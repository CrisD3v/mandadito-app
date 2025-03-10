const { body } = require('express-validator');
const dataUtils = require('../utils/data.utils');

const { Router } = require("express");
const routesRole = Router();
const roleController = require("../controllers/Role/roleController");
// const { authMiddleware } = require("../middlewares/AuthMiddleware");

// Validaciones
const registerValidations = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
];


routesRole.post(
  "/register", 
  dataUtils.validateFields(registerValidations),
  roleController.register
);

routesRole.put("/:id", roleController.update);

routesRole.delete("/:id", roleController.delete);

routesRole.get("/", roleController.findAll);

routesRole.get("/:id", roleController.findById);

module.exports = routesRole;
