import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsOptional } from '@nestjs/class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsOptional()
    delivery_user_id: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    starting_point: string;

    @IsString()
    @IsNotEmpty()
    drop_off_point: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}
