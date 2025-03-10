const { validationResult } = require('express-validator');
const AuthService = require('../src/aplication/authService');
const { login } = require("../src/infrastructure/controllers/User/authController");

// Mock de express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}));

// Mock del servicio de autenticación
jest.mock('../src/aplication/authService', () => ({
  default: jest.fn().mockImplementation(() => ({
    login: jest.fn()
  }))
}));

describe('Controlador de Login', () => {
  let req;
  let res;
  let authServiceInstance;

  beforeEach(() => {
    // Reiniciar los mocks antes de cada prueba
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
    
    // Create a new instance of AuthService for each test
    authServiceInstance = new AuthService();
    
    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  it('debería retornar 400 si la validación falla', async () => {
    // Simular errores de validación
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'El email es requerido' }]
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.any(Array)
    });
  });

  it('debería retornar 200 y un token cuando el login es exitoso', async () => {
    // Simular validación exitosa
    validationResult.mockReturnValue({
      isEmpty: () => true
    });

    // Simular login exitoso
    const mockToken = 'mock-jwt-token';
    authServiceInstance.login.mockResolvedValue({ token: mockToken });

    await login(req, res);

    expect(authServiceInstance.login).toHaveBeenCalledWith(req.body.email, req.body.password);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login exitoso',
      token: mockToken
    });
  });

  it('debería retornar 400 cuando el servicio de login lanza un error', async () => {
    // Simular validación exitosa
    validationResult.mockReturnValue({
      isEmpty: () => true
    });

    // Simular error en el servicio de login
    const errorMessage = 'Credenciales inválidas';
    authServiceInstance.login.mockRejectedValue(new Error(errorMessage));

    await login(req, res);

    expect(authServiceInstance.login).toHaveBeenCalledWith(req.body.email, req.body.password);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: errorMessage
    });
  });
});