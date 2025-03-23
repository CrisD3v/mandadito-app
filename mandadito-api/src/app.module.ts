import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { OrderModule } from './infrastructure/order/order.module';
import { UserModule } from './infrastructure/user/user.module';
import { AuthModule } from './infrastructure/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,  envFilePath: '.env' }), // Cargar variables de entorno
    TypeOrmModule.forRootAsync(databaseConfig), // Usa la configuración de BD
    OrderModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule { }
