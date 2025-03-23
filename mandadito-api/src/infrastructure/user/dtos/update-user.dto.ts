import { IsEmail, IsString, IsOptional, MinLength } from '@nestjs/class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    last_name: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsOptional()
    @MinLength(6)
    password: string;
}
