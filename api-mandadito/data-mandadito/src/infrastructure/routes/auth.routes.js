const { body } = require('express-validator');
const dataUtils = require('../utils/data.utils');

const { Router } = require("express");
const routesAuth = Router();
const authController = require("../controllers/User/authController");
const authMiddleware  = require("../middleware/authMiddleware");

// Validaciones
const registerValidations = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('last_name').notEmpty().withMessage('El apellido es obligatorio'),
  body('identification').notEmpty().withMessage('La identificación es obligatoria'),
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('phone').notEmpty().withMessage('El teléfono es obligatorio'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const updateValidations = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('last_name').notEmpty().withMessage('El apellido es obligatorio'),
  body('identification').notEmpty().withMessage('La identificación es obligatoria'),
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('phone').notEmpty().withMessage('El teléfono es obligatorio'),
];

const loginValidations = [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

routesAuth.post(
  "/register", 
  dataUtils.validateFields(registerValidations),
  authController.register
);

routesAuth.post(
  "/update",
  authMiddleware,
  dataUtils.validateFields(updateValidations),
  authController.update
);

routesAuth.get("/me", authMiddleware, authController.me);

routesAuth.post(
  "/login",
  dataUtils.validateFields(loginValidations),
  authController.login
);

routesAuth.post("/logout", authMiddleware, authController.logout);

module.exports = routesAuth;
