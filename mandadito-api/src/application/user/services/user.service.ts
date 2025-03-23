import { Injectable } from '@nestjs/common';
import { UserRepositoryImpl } from '../../../infrastructure/user/repositories/user.repository.impl';
import { User } from '../../../domain/user/entities/user.entity';
import { UpdateUserDto } from 'src/infrastructure/user/dtos/update-user.dto';
import { Role } from 'src/domain/user/entities/role.enum';
import * as bcrypt from 'bcrypt';

/**
 * Servicio para la gestión de usuarios en el sistema
 * Este servicio maneja todas las operaciones relacionadas con usuarios como
 * registro, consulta, actualización y eliminación.
 */
@Injectable()
export class UserService {
    /**
     * Constructor del servicio de usuarios
     * @param userRepository Repositorio de usuarios inyectado para el manejo de datos
     */
    constructor(private readonly userRepository: UserRepositoryImpl) { }

    /**
     * Registra un nuevo usuario en el sistema
     * @param name Nombre del usuario
     * @param last_name Apellido del usuario
     * @param identification Número de identificación único del usuario
     * @param email Correo electrónico del usuario
     * @param phone Número telefónico del usuario
     * @param password Contraseña del usuario
     * @param verify Indica si el usuario está verificado
     * @returns Promise<User> Usuario creado
     */
    async register(name: string, last_name: string, identification: number, email: string, phone: string, password: string, verify: boolean, roles: Role[] ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(
            crypto.randomUUID(),
            name,
            last_name,
            identification,
            email,
            phone,
            hashedPassword,
            verify,
            roles,
            new Date(),
            new Date(),
        );
        return this.userRepository.create(newUser);
    }

    /**
     * Obtiene un usuario por su identificador único
     * @param id Identificador único del usuario
     * @returns Promise<User | null> Usuario encontrado o null si no existe
     */
    async getUserById(id: string): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    /**
     * Obtiene un usuario por su correo electrónico
     * @param email Correo electrónico del usuario
     * @returns Promise<User | null> Usuario encontrado o null si no existe
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }


    /**
     * Actualiza la información de un usuario existente
     * @param id Identificador único del usuario a actualizar
     * @param name Nuevo nombre (opcional)
     * @param email Nuevo correo electrónico (opcional)
     * @param phone Nuevo número telefónico (opcional)
     * @param password Nueva contraseña (opcional)
     * @returns Promise<User | null> Usuario actualizado o null si no existe
     */
    async updateUser(id: string, userData:UpdateUserDto): Promise<User | null> {
        const user = await this.userRepository.findById(id);
        if (!user) return null;

        if (userData.name) user.updateName(userData.name);
        if (userData.last_name) user.updateName(userData.last_name);
        if (userData.email) user.updateEmail(userData.email);
        if (userData.phone) user.updatePhone(userData.phone);
        if (userData.password) user.updatePassword(userData.password);

        return this.userRepository.update(user);
    }

    /**
     * Elimina un usuario del sistema
     * @param id Identificador único del usuario a eliminar
     * @returns Promise<void>
     */
    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
