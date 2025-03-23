# Documentación de Mandadito API

## Descripción General
Mandadito API es un sistema de gestión de entregas construido con NestJS que maneja pedidos, usuarios y procesos de entrega.

## Tabla de Contenidos
- [Comenzando](#comenzando)
- [Arquitectura](#arquitectura)
- [Endpoints de la API](#endpoints-de-la-api)
- [Esquema de Base de Datos](#esquema-de-base-de-datos)
- [Autenticación](#autenticación)

# Comenzando

## Prerrequisitos
- Node.js (v14 o superior)
- npm o pnpm
- PostgreSQL

## Instalación
1. **Clonar el repositorio**:
2. **Instalar dependencias**:
```bash
pnpm install
```
3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Actualizar .env con tu configuración
## Ejecutar la Aplicación
### Desarrollo
```bash
pnpm run start:dev
```
### Producción
```bash
pnpm run build
pnpm run start:prod
```
### Pruebas
```bash
# pruebas unitarias
pnpm run test

# pruebas e2e
pnpm run test:e2e
```
## Arquitectura
### Estructura del Proyecto
```plaintext  
└── 📁mandadito-api
    └── 📁docs
        └── README.md # Documentación de la API
    └── 📁src
        └── app.module.ts # Módulo principal
        └── 📁application # Servicios de aplicación
            └── 📁auth
                └── 📁services
                    └── auth.service.ts 
            └── 📁order
                └── 📁services
                    └── order.service.ts
            └── 📁user
                └── 📁services
                    └── user.service.ts
        └── 📁config # Configuracion de la aplicacion
            └── database.config.ts
        └── 📁domain # Entidades y interfaces del dominio
            └── 📁order
                └── 📁entities
                    └── order.entity.ts
                └── 📁mappers
                    └── order.mapper.ts
                └── 📁repositories
                    └── order.repository.ts
            └── 📁user
                └── 📁entities
                    └── role.enum.ts
                    └── user.entity.ts
                └── 📁mappers
                    └── user.mapper.ts
                └── 📁repositories
                    └── user.repository.ts
        └── 📁infrastructure # Detalles de implementación
            └── 📁auth
                └── auth.module.ts
                └── 📁decorators
                    └── roles.decorator.ts
                └── 📁strategies
                    └── jwt.strategy.ts
            └── 📁order
                └── 📁controllers
                    └── order.controller.ts
                └── 📁dtos
                    └── create-order.dto.ts
                    └── update-order.dto.ts
                └── order.module.ts
                └── 📁repositories
                    └── order.repository.impl.ts
            └── 📁user
                └── 📁controllers
                    └── user.controller.ts
                └── 📁dtos
                    └── create-user.dto.ts
                    └── login.dto.ts
                    └── update-user.dto.ts
                └── 📁repositories
                    └── user.repository.impl.ts
                └── user.module.ts
        └── main.ts
        └── 📁shared # Utilidades y guardias compartidas
            └── 📁guards
                └── jwt-auth.guard.ts
                └── roles.guard.ts
    └── 📁test # Test de la api
        └── app.e2e-spec.ts
        └── jest-e2e.json
```
### Capas
1. **Capa de Dominio**
   
   - Contiene la lógica de negocio
   - Define entidades e interfaces
   - Independiente de frameworks externos
2. **Capa de Aplicación**
   
   - Implementa casos de uso
   - Orquesta objetos del dominio
   - Contiene servicios
3. **Capa de Infraestructura**
   
   - Implementa repositorios
   - Contiene controladores
   - Maneja código específico del framework
### Componentes Principales
- **Entidades** : Objetos core del negocio
- **Repositorios** : Interfaces de acceso a datos
- **Servicios** : Implementación de lógica de negocio
- **Controladores** : Manejadores de peticiones HTTP
- **DTOs** : Objetos de transferencia de datos
- **Guardias** : Manejadores de autenticación/autorización
## Endpoints de la API
### Usuarios Autenticación
- **POST** `/users/login`
  - Descripción: Autenticar usuario y obtener token JWT
  - Cuerpo: `{ email: string, password: string }`
  - Retorna: `{ user: User, access_token: string }` Gestión de Usuarios
- **POST** `/users`
  
  - Descripción: Crear nuevo usuario
  - Cuerpo: CreateUserDto
  - Retorna: Objeto User
- **GET** `/users/:id`
  
  - Descripción: Obtener usuario por ID
  - Autenticación: Requerida
  - Retorna: Objeto User
- **PATCH** `/users/:id`
  
  - Descripción: Actualizar información del usuario
  - Autenticación: Requerida
  - Cuerpo: UpdateUserDto
  - Retorna: Objeto User actualizado
- **DELETE** `/users/:id`
  
  - Descripción: Eliminar usuario
  - Autenticación: Requerida
### Pedidos Gestión de Pedidos
- **POST** `/orders`
  
  - Descripción: Crear nuevo pedido de entrega
  - Autenticación: Requerida
  - Cuerpo: CreateOrderDto
  - Retorna: Objeto Order
- **GET** `/orders/:id`
  
  - Descripción: Obtener detalles del pedido
  - Autenticación: Requerida
  - Retorna: Objeto Order
- **PATCH** `/orders/:id`
  
  - Descripción: Actualizar información del pedido
  - Autenticación: Requerida
  - Cuerpo: UpdateOrderDto
  - Retorna: Objeto Order actualizado
- **DELETE** `/orders/:id`
  
  - Descripción: Eliminar pedido
  - Autenticación: Requerida
## Esquema de Base de Datos
### Usuarios
```sql
Table users {
  id uuid [pk]
  name varchar
  last_name varchar
  identification varchar
  email varchar [unique]
  phone varchar
  password varchar
  verified boolean
  roles json
  created_at timestamp
  updated_at timestamp
}
 ```
 ### Pedidos
```sql
Table orders {
  id uuid [pk]
  user_id uuid [ref: > users.id]
  delivery_user_id uuid [ref: > users.id]
  title varchar
  description text
  starting_point varchar
  drop_off_point varchar
  price decimal
  status enum
  active_search boolean
  active boolean
  created_at timestamp
  updated_at timestamp
}
 ```
## Autenticación
La API utiliza autenticación basada en JWT (JSON Web Tokens). Para acceder a los endpoints protegidos, se debe incluir el token en el header de la petición:
```
Authorization: Bearer <token>
```
El token se obtiene al hacer login exitoso en el endpoint `/users/login`.

