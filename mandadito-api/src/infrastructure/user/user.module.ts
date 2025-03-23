import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../../application/user/services/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepositoryImpl } from './repositories/user.repository.impl'; // Importación correcta
import { User } from '../../domain/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    UserRepositoryImpl
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

