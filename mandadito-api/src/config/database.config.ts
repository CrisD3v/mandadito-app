/**
 * Configuración de la base de datos para NestJS usando TypeORM
 * 
 * Este archivo contiene dos configuraciones principales:
 * 1. databaseConfig: Configuración para el módulo TypeORM de NestJS
 * 2. dataSource: Configuración de la fuente de datos para TypeORM
 */

import { TypeOrmModuleOptions,  } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

/**
 * Configuración de la base de datos para el módulo TypeORM de NestJS
 * Utiliza ConfigService para manejar variables de entorno de manera segura
 * 
 * @property {Array} imports - Importa ConfigModule para acceder a variables de entorno
 * @property {Array} inject - Inyecta ConfigService para leer la configuración
 * @property {Function} useFactory - Función asíncrona que retorna la configuración de TypeORM
 */
export const databaseConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST', 'localhost'),
    port: configService.get<number>('DATABASE_PORT', 5432),
    username: configService.get<string>('DATABASE_USER', 'postgres'),
    password: configService.get<string>('DATABASE_PASSWORD', 'password'),
    database: configService.get<string>('DATABASE_NAME', 'mydatabase'), 
    entities: [__dirname + '/../domain/**/*.entity.{ts,js}'],    // Carga todas las entidades
    synchronize: configService.get<boolean>('DATABASE_SYNC', false), // ⚠️ Solo para desarrollo
    logging: configService.get<boolean>('DATABASE_LOGGING', true),
  }),
};

/**
 * Configuración de la fuente de datos para TypeORM
 * Utiliza variables de entorno directamente con valores por defecto
 * 
 * Esta configuración es necesaria para:
 * - Migraciones
 * - CLI de TypeORM
 * - Conexiones directas a la base de datos
 */
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'mydatabase',
  entities: [__dirname + '/../domain/**/*.entity.{ts,js}'],
  synchronize: process.env.DATABASE_SYNC === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',
});
