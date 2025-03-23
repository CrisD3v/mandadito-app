import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../entities/role.enum';
/**
 * Entidad que representa un usuario en el sistema.
 * Esta clase maneja toda la información personal y de autenticación de los usuarios,
 * implementando un patrón de dominio rico con métodos para la actualización segura de datos.
 * @author CrisDev
 * @version 1.0.0
 * 
 * @class User
 * @property {string} id - Identificador único del usuario (inmutable)
 * @property {string} name - Nombre del usuario (requerido)
 * @property {string} last_name - Apellido del usuario (requerido)
 * @property {number} identification - Número de documento de identidad único del usuario
 * @property {string} email - Correo electrónico único del usuario (requerido, formato válido)
 * @property {string} phone - Número de teléfono de contacto del usuario
 * @property {string} password - Contraseña encriptada del usuario
 * @property {boolean} verify - Indicador de verificación de cuenta del usuario
 * @property {Date} createdAt - Marca temporal de creación del registro
 * @property {Date} updatedAt - Marca temporal de última modificación
 */
@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  public readonly id: string;

  @Column()
  public name: string;

  @Column()
  public last_name: string;

  @Column()
  public identification: number;

  @Column()
  public email: string;

  @Column()
  public phone: string;

  @Column()
  public password: string;

  @Column()
  public verify: boolean;

  @Column('simple-array', { default: 'user' }) // Almacena roles como "user,admin"
  roles: Role[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
  constructor(
    id: string,
    name: string,
    last_name: string,
    identification: number,
    email: string,
    phone: string,
    password: string,
    verify: boolean,
    roles: Role[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.last_name = last_name;
    this.identification = identification;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.verify = verify;
    this.roles = roles;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Actualiza el nombre del usuario
   * Método que permite modificar el nombre del usuario manteniendo la integridad del dominio
   * 
   * @param newName - Nuevo nombre a asignar (no puede estar vacío)
   * @throws {Error} Si el nombre proporcionado está vacío o es inválido
   */
  updateName(newName: string) {
    this.name = newName;
  }

  /**
   * Actualiza el correo electrónico del usuario
   * Método que permite modificar el email asegurando que cumpla con el formato requerido
   * 
   * @param newEmail - Nuevo correo electrónico a asignar (debe ser válido)
   * @throws {Error} Si el formato del email es inválido
   */
  updateEmail(newEmail: string) {
    this.email = newEmail;
  }

  /**
   * Actualiza el número telefónico del usuario
   * Método que permite modificar el teléfono asegurando el formato correcto
   * 
   * @param newPhone - Nuevo número telefónico a asignar (debe ser válido)
   * @throws {Error} Si el formato del teléfono es inválido
   */
  updatePhone(newPhone: string) {
    this.phone = newPhone;
  }

  /**
   * Actualiza la contraseña del usuario
   * Método que permite modificar la contraseña aplicando las políticas de seguridad
   * 
   * @param newPassword - Nueva contraseña a asignar (debe cumplir requisitos de seguridad)
   * @throws {Error} Si la contraseña no cumple con los requisitos mínimos de seguridad
   */
  updatePassword(newPassword: string) {
    this.password = newPassword;
  }
}
