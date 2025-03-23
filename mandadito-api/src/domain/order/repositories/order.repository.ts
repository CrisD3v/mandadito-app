// domain/order/repositories/order.repository.ts
import { Order } from '../entities/order.entity';

/**
 * Interfaz que define las operaciones básicas para el repositorio de órdenes
 * Esta interfaz sigue el patrón Repository para abstraer las operaciones de persistencia
 */
export interface OrderRepository {
  /**
   * Crea una nueva orden en el sistema
   * @param order - Objeto Order con la información de la orden a crear
   * @returns Promise que resuelve con la orden creada incluyendo su ID
   */
  create(order: Order): Promise<Order>;

  /**
   * Busca una orden específica por su identificador único
   * @param id - Identificador único de la orden
   * @returns Promise que resuelve con la orden encontrada o null si no existe
   */
  findById(id: string): Promise<Order | null>;

  /**
   * Recupera todas las órdenes asociadas a un usuario específico
   * @param userId - Identificador único del usuario
   * @returns Promise que resuelve con un array de órdenes del usuario
   */
  findByUserId(userId: string): Promise<Order[]>;

  /**
   * Actualiza la información de una orden existente
   * @param order - Objeto Order con la información actualizada
   * @returns Promise que resuelve con la orden actualizada
   */
  update(order: Order): Promise<Order>;

  /**
   * Elimina una orden del sistema
   * @param id - Identificador único de la orden a eliminar
   * @returns Promise que resuelve cuando la orden ha sido eliminada
   */
  delete(id: string): Promise<void>;
}
