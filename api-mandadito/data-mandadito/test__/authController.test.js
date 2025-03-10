const { validationResult } = require('express-validator');
const authController = require("../src/infrastructure/controllers/User/authController");
const authService = require('../src/aplication/authService');

// Simulación de express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}));

// Simulación del servicio de autenticación
jest.mock('../src/aplication/authService', () => ({
  login: jest.fn()
}));

describe('Controlador de Inicio de Sesión', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reiniciar las simulaciones
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    // Limpiar todas las simulaciones
    jest.clearAllMocks();
  });

  it('debería retornar 400 si la validación falla', async () => {
    // Simular errores de validación
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'El email es requerido' }]
    });

    authController.login

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.any(Array)
    });
  });

  it('debería retornar 200 y un token cuando el inicio de sesión es exitoso', async () => {
    // Simular validación exitosa
    validationResult.mockReturnValue({
      isEmpty: () => true
    });

    // Simular inicio de sesión exitoso
    const mockToken = 'mock-jwt-token';
    authService.login.mockResolvedValue({ token: mockToken });

    authController.login

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login exitoso',
      token: mockToken
    });
  });

  it('debería retornar 400 cuando el servicio de inicio de sesión genera un error', async () => {
    // Simular validación exitosa
    validationResult.mockReturnValue({
      isEmpty: () => true
    });

    // Simular error en el servicio de inicio de sesión
    const errorMessage = 'Credenciales inválidas';
    authService.login.mockRejectedValue(new Error(errorMessage));

    authController.login

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: errorMessage
    });
  });
});