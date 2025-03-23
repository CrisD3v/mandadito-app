// infrastructure/order/services/order.service.ts
import { Injectable } from '@nestjs/common';
import { OrderRepositoryImpl } from '../../../infrastructure/order/repositories/order.repository.impl';
import { Order } from '../../../domain/order/entities/order.entity';

/**
 * Servicio que maneja la lógica de negocio relacionada con las órdenes de entrega.
 * Implementa operaciones CRUD y estados del ciclo de vida de una orden.
 */
@Injectable()
export class OrderService {
    constructor(
        // @Inject(Order) // ✅ Usa el mismo string en todas partes
        private readonly orderRepository: OrderRepositoryImpl,
    ) { }

    /**
     * Registra una nueva orden en el sistema
     * @param userId - ID del usuario que crea la orden
     * @param delivery_user_id - ID del repartidor asignado
     * @param title - Título descriptivo de la orden
     * @param description - Descripción detallada de la orden
     * @param starting_point - Punto de recogida
     * @param drop_off_point - Punto de entrega
     * @param price - Precio del servicio
     * @param status - Estado inicial de la orden (queue por defecto)
     * @param active_search - Indica si la orden está en búsqueda activa de repartidor
     * @param active - Indica si la orden está activa en el sistema
     * @returns Promise<Order> - Nueva orden creada
     */
    async register(userId: string, delivery_user_id:string, title: string, description: string, starting_point: string, drop_off_point: string, price: number, status: "queue", active_search: boolean, active: boolean): Promise<Order> {
        const newOrder = new Order(
            crypto.randomUUID(),
            userId,
            delivery_user_id,
            title,
            description,
            starting_point,
            drop_off_point,
            price,
            status,
            active_search,
            active,
            new Date(),
            new Date(),
        );
        return this.orderRepository.create(newOrder);
    }

    /**
     * Busca una orden por su identificador único
     * @param id - Identificador único de la orden
     * @returns Promise<Order | null> - Orden encontrada o null si no existe
     */
    async getOrderById(id: string): Promise<Order | null> {
        return this.orderRepository.findById(id);
    }

    /**
     * Actualiza los datos básicos de una orden existente
     * @param id - Identificador de la orden a actualizar
     * @param title - Nuevo título (opcional)
     * @param description - Nueva descripción (opcional)
     * @returns Promise<Order | null> - Orden actualizada o null si no existe
     */
    async update(id: string, title?: string, description?: string): Promise<Order | null> {
        const order = await this.orderRepository.findById(id);
        if (!order) return null;

        if (title) order.updateTitle(title);
        if (description) order.updateDescription(description);

        return this.orderRepository.update(order);
    }

    /**
     * Cancela una orden existente
     * @param id - Identificador de la orden a cancelar
     * @returns Promise<Order | null> - Orden cancelada o null si no existe
     */
    async cancelOrder(id: string): Promise<Order | null> {
        const order = await this.orderRepository.findById(id);
        if (!order) return null;

        order.cancelOrder();
        return this.orderRepository.update(order);
    }

    /**
     * Asigna un repartidor a una orden
     * @param id - Identificador de la orden
     * @param deliveryUserId - ID del repartidor a asignar
     * @returns Promise<Order | null> - Orden actualizada o null si no existe
     */
    async takeOrder(id: string, deliveryUserId: string): Promise<Order | null> {
        const order = await this.orderRepository.findById(id);
        if (!order) return null;

        order.assignDelivery(deliveryUserId);
        return this.orderRepository.update(order);
    }

    /**
     * Cancela la entrega de una orden
     * @param id - Identificador de la orden
     * @returns Promise<Order | null> - Orden actualizada o null si no existe
     */
    async cancelDelivery(id: string): Promise<Order | null> {
        const order = await this.orderRepository.findById(id);
        if (!order) return null;

        order.cancelDelivery();
        return this.orderRepository.update(order);
    }

    /**
     * Reactiva una orden previamente cancelada
     * @param id - Identificador de la orden
     * @returns Promise<Order | null> - Orden reactivada o null si no existe
     */
    async reactivateOrder(id: string): Promise<Order | null> {
        const order = await this.orderRepository.findById(id);
        if (!order) return null;

        order.reactivateOrder();
        return this.orderRepository.update(order);
    }

    /**
     * Confirma la asignación de una orden a un repartidor
     * @param id - Identificador de la orden
     * @returns Promise<Order | null> - Orden confirmada o null si no existe
     */
    async confirmDeliveryOrder(id: string): Promise<Order | null> {
        const order = await this.orderRepository.findById(id);
        if (!order) return null;

        order.confirmDeliveryOrder();
        return this.orderRepository.update(order);
    }

    /**
     * Marca una orden como recogida por el repartidor
     * @param id - Identificador de la orden
     * @returns Promise<Order | null> - Orden actualizada o null si no existe
     */
    async takeBoxOrder(id: string): Promise<Order | null> {
        const order = await this.orderRepository.findById(id);
        if (!order) return null;

        order.deliveringOrder();
        return this.orderRepository.update(order);
    }

    /**
     * Marca una orden como entregada completamente
     * @param id - Identificador de la orden
     * @returns Promise<Order | null> - Orden completada o null si no existe
     */
    async completeDelivery(id: string): Promise<Order | null> {
        const order = await this.orderRepository.findById(id);
        if (!order) return null;

        order.completeDelivery(); 
        return this.orderRepository.update(order);
    }

    /**
     * Elimina una orden del sistema
     * @param id - Identificador de la orden a eliminar
     */
    async deleteOrder(id: string): Promise<void> {
        await this.orderRepository.delete(id);
    }
}
