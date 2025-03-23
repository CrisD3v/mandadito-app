import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../../domain/user/repositories/user.repository';
import { User } from '../../../domain/user/entities/user.entity';

/**
 * Implementación del repositorio de usuarios que gestiona la persistencia de datos
 * de usuarios en la base de datos utilizando TypeORM.
 * 
 * Esta clase implementa la interfaz UserRepository y proporciona métodos CRUD
 * para la entidad User.
 */
@Injectable()
export class UserRepositoryImpl implements UserRepository {
    /**
     * Constructor que inyecta el repositorio de TypeORM para la entidad User
     * @param userRepo Repositorio de TypeORM para la entidad User
     */
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    /**
     * Crea un nuevo usuario en la base de datos
     * @param user Entidad de usuario a crear
     * @returns Promise con el usuario creado
     */
    async create(user: User): Promise<User> {
        return this.userRepo.save(user);
    }

    /**
     * Busca un usuario por su ID
     * @param id ID del usuario a buscar
     * @returns Promise con el usuario encontrado o null si no existe
     */
    async findById(id: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { id } }) || null;
    }

    /**
     * Busca un usuario por su correo electrónico
     * @param email Correo electrónico del usuario a buscar
     * @returns Promise con el usuario encontrado o null si no existe
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { email } }) || null;
    }

    /**
     * Actualiza los datos de un usuario existente
     * @param user Entidad de usuario con los datos actualizados
     * @returns Promise con el usuario actualizado
     */
    async update(user: User): Promise<User> {
        await this.userRepo.save(user);
        return user;
    }

    /**
     * Elimina un usuario de la base de datos
     * @param id ID del usuario a eliminar
     * @returns Promise<void>
     */
    async delete(id: string): Promise<void> {
        await this.userRepo.delete(id);
    }
}
