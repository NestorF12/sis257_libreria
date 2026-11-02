# Backend sis257_libreria (NestJS)

API REST del sistema de gestión y ventas para librería.

## Tecnologías
- NestJS (TypeScript)
- TypeORM
- Swagger (documentación de la API)
- JWT (autenticación)

## Estado
En construcción.

## Plan de trabajo
- [x] Crear carpeta del backend
- [ ] Crear proyecto NestJS (`nest new backend_libreria --skip-git`)
- [ ] Configurar base de datos con TypeORM
- [ ] Crear entities a partir del README principal
- [ ] Validaciones y Swagger
- [ ] CRUD de 3 catálogos (categorías, autores, libros)
- [ ] Login con JWT
- [ ] Endpoints de compra/venta

# Backend - Proyecto Librería (SIS257)

Backend desarrollado en **NestJS** utilizando **TypeORM** para la gestión de bases de datos relacionales con **PostgreSQL**.

## 🛠️ Tecnologías y Dependencias
* **Framework:** NestJS
* **ORM:** TypeORM (`@nestjs/typeorm`)
* **Base de datos:** PostgreSQL
* **Driver de conexión:** `pg`
* **Entorno de desarrollo:** Node.js

## ⚙️ Configuración de la Base de Datos
La aplicación se conecta a una instancia local de PostgreSQL con los siguientes parámetros:
* **Host:** `localhost`
* **Puerto:** `5432`
* **Base de datos:** `proyecto_libreria`
* **Usuario:** `postgres`
* **Contraseña:** `123456`

## 🚀 Instalación y Ejecución

1. Instala las dependencias del proyecto:
   ```bash
   npm install 

## 📦 Entidades y Estructura de la Base de Datos (`proyecto_libreria`)

El sistema gestiona las siguientes entidades principales mediante TypeORM:

* **Usuarios:** Gestión de clientes o administradores del sistema.
* **Autores:** Información de los escritores de los libros registrados.
* **Categorías:** Clasificación y géneros literarios de los libros.
* **Libros:** Inventario de libros, precios, stock y su relación con autores y categorías.
* **Ventas:** Registro general de transacciones de compra.
* **DetalleVentas:** Detalle de los libros y cantidades incluidas en cada venta realizada.
