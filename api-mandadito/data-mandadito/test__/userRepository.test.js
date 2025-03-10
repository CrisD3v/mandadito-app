const UserRepository = require('../src/infrastructure/repositories/userRepository');
const { User, Role } = require('../src/config/Db');

// Mock de los modelos de Sequelize
jest.mock('../src/config/Db', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn()
  },
  Role: {
    findByPk: jest.fn()
  }
}));

describe('UserRepository', () => {
  let userRepository;

  // Datos de prueba
  const mockUserData = {
    name: 'Juan',
    last_name: 'Pérez',
    identification: '123456789',
    email: 'juan@example.com',
    phone: '1234567890',
    password: 'hashedPassword123'
  };

  const mockRole = {
    id: 1,
    name: 'usuario'
  };

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    userRepository = new UserRepository();
  });

  describe('create', () => {
    it('debería crear un usuario con rol correctamente', async () => {
      // Preparar los mocks
      const mockCreatedUser = {
        ...mockUserData,
        id: 1,
        setRole: jest.fn().mockResolvedValue(true)
      };
      
      User.create.mockResolvedValue(mockCreatedUser);
      Role.findByPk.mockResolvedValue(mockRole);

      // Ejecutar el método
      const result = await userRepository.create(mockUserData, mockRole.id);

      // Verificaciones
      expect(User.create).toHaveBeenCalledWith(mockUserData);
      expect(Role.findByPk).toHaveBeenCalledWith(mockRole.id);
      expect(mockCreatedUser.setRole).toHaveBeenCalledWith(mockRole);
      expect(result).toEqual(mockCreatedUser);
    });

    it('debería retornar mensaje de error cuando el rol no existe', async () => {
      // Preparar los mocks
      const mockCreatedUser = {
        ...mockUserData,
        id: 1,
        setRole: jest.fn()
      };
      
      User.create.mockResolvedValue(mockCreatedUser);
      Role.findByPk.mockResolvedValue(null);

      // Ejecutar el método
      const result = await userRepository.create(mockUserData, 999);

      // Verificaciones
      expect(Role.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBe('El rol no se encontro');
      expect(mockCreatedUser.setRole).not.toHaveBeenCalled();
    });

    it('debería manejar errores durante la creación', async () => {
      // Preparar el mock para simular un error
      const error = new Error('Error de base de datos');
      User.create.mockRejectedValue(error);

      // Ejecutar y verificar que se maneja el error
      await expect(userRepository.create(mockUserData, mockRole.id))
        .rejects
        .toThrow('Error de base de datos');
    });
  });

  describe('findByEmail', () => {
    it('debería encontrar un usuario por email correctamente', async () => {
      // Preparar el mock
      const mockFoundUser = {
        ...mockUserData,
        id: 1
      };
      
      User.findOne.mockResolvedValue(mockFoundUser);

      // Ejecutar el método
      const result = await userRepository.findByEmail(mockUserData.email);

      // Verificaciones
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: mockUserData.email }
      });
      expect(result).toEqual(mockFoundUser);
    });

    it('debería retornar null cuando no encuentra el usuario', async () => {
      // Preparar el mock
      User.findOne.mockResolvedValue(null);

      // Ejecutar el método
      const result = await userRepository.findByEmail('noexiste@example.com');

      // Verificaciones
      expect(result).toBeNull();
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'noexiste@example.com' }
      });
    });

    it('debería manejar errores en la búsqueda', async () => {
      // Preparar el mock para simular un error
      const error = new Error('Error en la búsqueda');
      User.findOne.mockRejectedValue(error);

      // Ejecutar y verificar que se maneja el error
      await expect(userRepository.findByEmail(mockUserData.email))
        .rejects
        .toThrow('Error en la búsqueda');
    });
  });
});