// src/domain/order/mappers/order.mapper.ts
import { Order } from '../entities/order.entity';

/**
 * @interface PersistenceOrderModel
 * @description Estructura genérica para representar una orden en la capa de persistencia.
 */
interface PersistenceOrderModel {
  id: string;
  user_id: string;
  delivery_user_id: string;
  title: string;
  description: string;
  starting_point: string;
  drop_off_point: string;
  price: number;
  status:'queue' | 'pending' | 'picking' | 'delivering' | 'completed' | 'cancelled';
  active_search: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * @class OrderMapper
 * @description Mapper para convertir entre el dominio `Order` y la capa de persistencia.
 */
export class OrderMapper {
  /**
   * Convierte un modelo de persistencia en una entidad del dominio.
   */
  static toDomain(raw: PersistenceOrderModel): Order {
    return new Order(
      raw.id,
      raw.user_id,
      raw.delivery_user_id,
      raw.title,
      raw.description,
      raw.starting_point,
      raw.drop_off_point,
      raw.price,
      raw.status,
      raw.active_search,
      raw.active,
      raw.created_at,
      raw.updated_at,
    );
  }

  /**
   * Convierte una entidad de dominio en un objeto listo para persistencia.
   */
  static toPersistence(order: Order): PersistenceOrderModel {
    return {
      id: order.id,
      user_id: order.userId,
      delivery_user_id: order.delivery_user_id,
      title: order.title,
      description: order.description,
      starting_point: order.starting_point,
      drop_off_point: order.drop_off_point,
      price: order.price,
      status: order.status,
      active_search: order.active_search,
      active: order.active,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    };
  }
}
