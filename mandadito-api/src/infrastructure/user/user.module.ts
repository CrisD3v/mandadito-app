import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../../application/user/services/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepositoryImpl } from './repositories/user.repository.impl'; // Importación correcta
import { User } from '../../domain/user/entities/user.entity';
import { AuthModule } from '../auth/auth.module'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    UserRepositoryImpl
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

