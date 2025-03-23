import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
/**
 * Clase que representa una orden de entrega en el sistema de delivery
 * Esta clase maneja todo el ciclo de vida de una orden, desde su creación hasta su finalización
 * @author CrisDev
 * @version 1.0.0
 */
@Entity('orders')
export class Order {
    @PrimaryColumn('uuid')
    public readonly id: string;

    @Column()
    public userId: string;

    @Column({ nullable: true })
    public delivery_user_id: string;

    @Column()
    public title: string;

    @Column()
    public description: string;

    @Column()
    public starting_point: string;

    @Column()
    public drop_off_point: string;

    @Column('decimal', { precision: 10, scale: 2 })
    public price: number;

    @Column({
        type: 'enum',
        enum: ['queue', 'pending', 'picking', 'delivering', 'completed', 'cancelled'],
        default: 'queue'
    })
    public status: 'queue' | 'pending' | 'picking' | 'delivering' | 'completed' | 'cancelled';

    @Column({ default: true })
    public active_search: boolean;

    @Column({ default: true })
    public active: boolean;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    constructor(
        id: string,
        userId: string,
        delivery_user_id: string,
        title: string,
        description: string,
        starting_point: string,
        drop_off_point: string,
        price: number,
        status: 'queue' | 'pending' | 'picking' | 'delivering' | 'completed' | 'cancelled',
        active_search: boolean,
        active: boolean,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.userId = userId;
        this.delivery_user_id = delivery_user_id;
        this.title = title;
        this.description = description;
        this.starting_point = starting_point;
        this.drop_off_point = drop_off_point;
        this.price = price;
        this.status = status;
        this.active_search = active_search;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Asigna un repartidor a la orden y actualiza su estado
     * @param deliveryUserId - ID del repartidor que acepta la orden
     * @throws {Error} Si la orden no está en estado válido para asignación
     */
    assignDelivery(deliveryUserId: string): void {
        this.status = 'pending';
        this.delivery_user_id = deliveryUserId;
        this.active_search = false;
        this.updatedAt = new Date();
    }

    /**
     * Confirma que el repartidor ha iniciado el proceso de recolección
     * @throws {Error} Si la orden no está en estado 'pending'
     */
    confirmDeliveryOrder(): void {
        this.status = 'picking';
        this.updatedAt = new Date();
    }

    /**
     * Actualiza el estado de la orden a 'delivering' cuando el repartidor
     * ha recogido el pedido y se dirige al punto de entrega
     * @throws {Error} Si la orden no está en estado 'picking'
     */
    deliveringOrder(): void {
        this.status = 'delivering';
        this.updatedAt = new Date();
    }

    /**
     * Marca la orden como completada y la desactiva en el sistema
     * Este método debe llamarse solo cuando se ha confirmado la entrega
     * @throws {Error} Si la orden no está en estado 'delivering'
     */
    completeDelivery(): void {
        this.status = 'completed';
        this.active = false;
        this.updatedAt = new Date();
    }

    /**
     * Cancela la orden manteniéndola en su estado actual
     * Útil para cancelaciones temporales o administrativas
     */
    cancelOrder(): void {
        this.active = false;
        this.updatedAt = new Date();
    }

    /**
     * Cancela definitivamente la orden de entrega
     * Este método cambia el estado a 'cancelled' y actualiza el timestamp
     */
    cancelDelivery(): void {
        this.status = 'cancelled';
        this.updatedAt = new Date();
    }

    /**
     * Reactiva una orden previamente cancelada
     * Reinicia los valores de búsqueda y elimina la asignación del repartidor
     * @throws {Error} Si la orden no está en estado cancelado
     */
    reactivateOrder(): void {
        this.status = 'queue';
        this.active_search = true;
        this.delivery_user_id = '';
        this.updatedAt = new Date();
    }

    /**
     * Actualiza el título de la orden
     * @param newTitle - Nuevo título para la orden
     * @throws {Error} Si el título está vacío o excede el límite de caracteres
     */
    updateTitle(newTitle: string): void {
        this.title = newTitle;
        this.updatedAt = new Date();
    }

    /**
     * Actualiza la descripción de la orden
     * @param newDescription - Nueva descripción para la orden
     * @throws {Error} Si la descripción está vacía o excede el límite de caracteres
     */
    updateDescription(newDescription: string): void {
        this.description = newDescription;
        this.updatedAt = new Date();
    }
}
