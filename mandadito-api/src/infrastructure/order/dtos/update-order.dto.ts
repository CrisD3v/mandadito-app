import { IsOptional, IsString } from '@nestjs/class-validator';

export class UpdateOrderDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
