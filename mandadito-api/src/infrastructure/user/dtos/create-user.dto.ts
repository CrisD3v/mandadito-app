import { IsEmail, IsString, IsNumber, IsNotEmpty, MinLength } from '@nestjs/class-validator';
import { Role } from 'src/domain/user/entities/role.enum';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsNumber()
    identification: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    roles: Role[];

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
