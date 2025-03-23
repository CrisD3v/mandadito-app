import { Inject, UseGuards } from '@nestjs/common';
import { Controller, Post, Get, Patch, Delete, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '../../../application/user/services/user.service';
import { AuthService } from '../../../application/auth/services/auth.service';
import { User } from '../../../domain/user/entities/user.entity';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

/**
 * Controlador para la gestión de usuarios
 * Este controlador maneja todas las operaciones CRUD relacionadas con usuarios
 * incluyendo creación, lectura, actualización y eliminación de usuarios.
 */
@Controller('users')
export class UserController {
    /**
     * Constructor del controlador
     * @param userService Servicio de usuarios inyectado para manejar la lógica de negocio
     */
    constructor(
        @Inject(UserService) private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    /**
     * Crea un nuevo usuario en el sistema
     * @param userData Datos del usuario a crear (nombre, apellido, identificación, email, teléfono y contraseña)
     * @returns Promise con el usuario creado
     */
    @Post('')
    async createUser(@Body() userData: CreateUserDto): Promise<User> {
        return this.userService.register(
            userData.name,
            userData.last_name,
            userData.identification,
            userData.email,
            userData.phone,
            userData.password,
            false,
            userData.roles,
        );
    }

    /**
     * Realiza el inicio de sesión de un usuario
     * @param loginDto Datos de inicio de sesión (email y contraseña)
     * @returns Promise con los datos del usuario autenticado y un token JWT
     * @throws UnauthorizedException si las credenciales son inválidas
     */
    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        return this.authService.login(user);
    }

    /**
     * Obtiene un usuario por su ID
     * @param id Identificador único del usuario
     * @returns Promise con el usuario encontrado o null si no existe
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUserById(@Param('id') id: string): Promise<User | null> {
        return this.userService.getUserById(id);
    }

    /**
     * Actualiza los datos de un usuario existente
     * @param id Identificador único del usuario a actualizar
     * @param userData Datos actualizados del usuario (excluyendo ID, identificación, verificación y timestamps)
     * @returns Promise con el usuario actualizado o null si no se encontró
     */
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<User | null> {
        return this.userService.updateUser(id, userData);
    }

    /**
     * Elimina un usuario del sistema
     * @param id Identificador único del usuario a eliminar
     * @returns Promise<void>
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Param('id') id: string): Promise<void> {
        await this.userService.deleteUser(id);
    }
}