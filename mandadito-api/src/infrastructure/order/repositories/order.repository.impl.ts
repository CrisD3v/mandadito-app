/**
 * Implementación del repositorio de órdenes que maneja la persistencia de datos
 * para las órdenes en la aplicación.
 * 
 * Esta clase implementa la interfaz OrderRepository y proporciona métodos
 * para realizar operaciones CRUD sobre las órdenes en la base de datos.
 * 
 * @class OrderRepositoryImpl
 * @implements {OrderRepository}
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../../domain/order/entities/order.entity';
import { OrderRepository } from '../../../domain/order/repositories/order.repository';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
    /**
     * Constructor de la clase OrderRepositoryImpl
     * @param orderRepo - Repositorio de TypeORM para la entidad Order
     */
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>
    ) {}

    /**
     * Crea una nueva orden en la base de datos
     * @param order - Objeto Order con los datos de la orden a crear
     * @returns Promise<Order> - La orden creada con su ID asignado
     */
    async create(order: Order): Promise<Order> {
        return this.orderRepo.save(order);
    }

    /**
     * Busca una orden por su ID
     * @param id - ID único de la orden
     * @returns Promise<Order | null> - La orden encontrada o null si no existe
     */
    async findById(id: string): Promise<Order | null> {
        return this.orderRepo.findOne({ where: { id } }) || null;
    }

    /**
     * Obtiene todas las órdenes asociadas a un usuario específico
     * @param userId - ID del usuario
     * @returns Promise<Order[]> - Array de órdenes del usuario
     */
    async findByUserId(userId: string): Promise<Order[]> {
        return this.orderRepo.find({ where: { userId } });
    }

    /**
     * Actualiza una orden existente en la base de datos
     * @param order - Objeto Order con los datos actualizados
     * @returns Promise<Order> - La orden actualizada
     */
    async update(order: Order): Promise<Order> {
        await this.orderRepo.save(order);
        return order;
    }

    /**
     * Elimina una orden de la base de datos
     * @param id - ID de la orden a eliminar
     * @returns Promise<void>
     */
    async delete(id: string): Promise<void> {
        await this.orderRepo.delete(id);
    }
}
