// src/domain/user/mappers/user.mapper.ts
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.enum';

/**
 * @interface PersistenceUserModel
 * @description Define una estructura de datos genérica para la persistencia sin
 * depender de implementaciones específicas como Prisma o TypeORM.
 */
interface PersistenceUserModel {
    id: string;
    name: string;
    last_name: string;
    identification: number;
    email: string;
    phone: string;
    password: string;
    verify: boolean;
    roles: Role[]; // Cambiado a Role[] en lugar de string[] para reflejar el enum Role en UserMode
    created_at: Date;
    updated_at: Date;
}

/**
 * @class UserMapper
 * @description Mapper para convertir entre el dominio `User` y la capa de persistencia.
 */
export class UserMapper {
    /**
     * @static toDomain
     * @description Convierte un objeto plano en una entidad del dominio.
     */
    static toDomain(raw: PersistenceUserModel): User {
        return new User(
            raw.id,
            raw.name,
            raw.last_name,
            raw.identification,
            raw.email,
            raw.password,
            raw.phone,
            raw.verify,
            raw.roles,
            raw.created_at,
            raw.updated_at,
        );
    }

    /**
     * @static toPersistence
     * @description Convierte una entidad de dominio en un formato listo para la persistencia.
     */
    static toPersistence(user: User): PersistenceUserModel {
        return {
            id: user.id,
            name: user.name,
            last_name: user.last_name,
            identification: user.identification,
            email: user.email,
            phone: user.phone,
            password: user.password,
            verify: user.verify,
            roles: user.roles,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        };
    }
}
