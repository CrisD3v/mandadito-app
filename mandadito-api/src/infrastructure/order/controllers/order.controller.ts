import { Inject } from '@nestjs/common';
import { Controller, Post, Get, Patch, Delete, Body, Param, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { OrderService } from '../../../application/order/services/order.service';
import { Order } from '../../../domain/order/entities/order.entity';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../../domain/user/entities/role.enum';


/**
 * Controlador para la gestión de órdenes de entrega
 * Este controlador maneja todas las operaciones CRUD y estados del ciclo de vida
 * de una orden de entrega en el sistema.
 */
@UseGuards(JwtAuthGuard) // Protege todas las rutas con autenticación JWT
@Controller('orders')
export class OrderController {
    constructor(@Inject(OrderService) private readonly orderService: OrderService) {}

    /**
     * Crea una nueva orden en el sistema
     * @param orderData Datos de la orden excluyendo id y timestamps
     * @returns La orden creada
     */
    @Roles(Role.USER)
    @Post('')
    @UsePipes(new ValidationPipe({ whitelist: true })) // Aplica validaciones de DTO
    async createOrder(@Body() orderData: CreateOrderDto): Promise<Order> {
        return this.orderService.register(
            orderData.userId,
            '',
            orderData.title,
            orderData.description,
            orderData.starting_point,
            orderData.drop_off_point,
            orderData.price,
            "queue",
            true,
            true
        );
    }

    /**
     * Obtiene una orden específica por su ID
     * @param id Identificador único de la orden
     * @returns La orden encontrada o null si no existe
     */
    @Get(':id')
    async getOrder(@Param('id') id: string): Promise<Order | null> {
        return this.orderService.getOrderById(id);
    }

    /**
     * Actualiza los datos básicos de una orden
     * @param id Identificador de la orden
     * @param updateData Datos a actualizar (título y descripción)
     * @returns La orden actualizada
     */
    @Roles(Role.USER)
    @Patch(':id')
    @UsePipes(new ValidationPipe({ whitelist: true })) // Aplica validaciones de DTO
    async updateOrder(
        @Param('id') id: string,
        @Body() updateData:UpdateOrderDto ): Promise<Order | null> {
        return this.orderService.update(id, updateData.title, updateData.description);
    }

    /**
     * Cancela una orden existente
     * @param id Identificador de la orden
     * @returns La orden cancelada
     */
    @Roles(Role.USER)
    @Patch(':id/cancel-order')
    async cancelOrder(@Param('id') id: string): Promise<Order | null> {
        return this.orderService.cancelOrder(id);
    }

    /**
     * Asigna una orden a un repartidor
     * @param id Identificador de la orden
     * @param deliveryUserId Identificador del repartidor
     * @returns La orden asignada
     */
    @Roles(Role.DELIVERY)
    @Patch(':id/take-order')
    async takeOrder(@Param('id') id: string, @Param('deliveryUserId') deliveryUserId:string): Promise<Order | null> {
        return this.orderService.takeOrder(id, deliveryUserId);
    }

    /**
     * Cancela la entrega de una orden
     * @param id Identificador de la orden
     * @returns La orden con entrega cancelada
     */
    @Roles(Role.DELIVERY)
    @Patch(':id/cancel-delivery')
    async cancelDelivery(@Param('id') id: string): Promise<Order | null> {
        return this.orderService.cancelDelivery(id);
    }

    /**
     * Reactiva una orden previamente cancelada
     * @param id Identificador de la orden
     * @returns La orden reactivada
     */
    @Roles(Role.USER)
    @Patch(':id/reactivate-order')
    async reactivateOrder(@Param('id') id: string): Promise<Order | null> {
        return this.orderService.reactivateOrder(id); 
    }

    /**
     * Confirma que una orden está lista para ser entregada
     * @param id Identificador de la orden
     * @returns La orden confirmada
     */
    @Roles(Role.DELIVERY)
    @Patch(':id/confirm-delivery-order')
    async confirmDeliveryOrder(@Param('id') id: string): Promise<Order | null> {
        return this.orderService.confirmDeliveryOrder(id);
    }

    /**
     * Registra la recolección del paquete por parte del repartidor
     * @param id Identificador de la orden
     * @returns La orden actualizada
     */
    @Roles(Role.DELIVERY)
    @Patch(':id/take-box-order')
    async takeBoxOrder(@Param('id') id: string): Promise<Order | null> {
        return this.orderService.takeBoxOrder(id);
    }

    /**
     * Marca una orden como completamente entregada
     * @param id Identificador de la orden
     * @returns La orden completada
     */
    @Roles(Role.DELIVERY)
    @Patch(':id/complete-delivery-order')
    async completeDeliveryOrder(@Param('id') id: string): Promise<Order | null> {
        return this.orderService.completeDelivery(id);
    }

    /**
     * Elimina una orden del sistema
     * @param id Identificador de la orden
     */
    @Delete(':id')
    async deleteOrder(@Param('id') id: string): Promise<void> {
        return this.orderService.deleteOrder(id);
    }
}
