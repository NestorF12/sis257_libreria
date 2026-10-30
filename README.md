# Proyecto SIS257: Sistema de Gestión y Ventas para Librería (`sis257_libreria`)

## 1. Descripción del Negocio
Sistema web orientado a la gestión de inventario y el proceso de compra/venta de libros en una librería. Permite administrar los catálogos de publicaciones, categorías y autores, controlar el stock disponible, registrar clientes y realizar transacciones de venta con autenticación segura mediante JWT.

## 2. Problemática
Las librerías locales suelen registrar sus transacciones manuales o mediante herramientas no centralizadas, lo que genera descontrol en el stock de libros, lentitud en el proceso de atención en caja y falta de reportes precisos sobre los títulos más vendidos o la disponibilidad por categorías.

## 3. Entidades Principales y Campos Tentativos

### 👤 1. Usuario (`usuarios`)
* `id` (PK, Int, Auto-increment)
* `usuario` (Varchar, Unique)
* `clave` (Varchar - Encrypted/Hashed)
* `email` (Varchar, Unique)
* `rol` (Varchar: 'admin', 'cliente')
* `premium` (Boolean)

### ✍️ 2. Autor (`autores`) - *Catálogo 1*
* `id` (PK, Int)
* `nombre` (Varchar)
* `nacionalidad` (Varchar)

### 📂 3. Categoria (`categorias`) - *Catálogo 2*
* `id` (PK, Int)
* `nombre` (Varchar)
* `descripcion` (Text)

### 📚 4. Libro (`libros`) - *Catálogo 3*
* `id` (PK, Int)
* `titulo` (Varchar)
* `isbn` (Varchar, Unique)
* `precio` (Decimal)
* `stock` (Integer)
* `id_autor` (FK -> autores.id)
* `id_categoria` (FK -> categorias.id)

### 🛒 5. Venta (`ventas`) - *Módulo Principal (Mayor puntaje)*
* `id` (PK, Int)
* `fecha` (Timestamp)
* `total` (Decimal)
* `id_usuario` (FK -> usuarios.id)

### 📋 6. Detalle de Venta (`detalle_ventas`)
* `id` (PK, Int)
* `id_venta` (FK -> ventas.id)
* `id_libro` (FK -> libros.id)
* `cantidad` (Integer)
* `subtotal` (Decimal)

## 4. Estructura del Proyecto
* `backend_libreria/`: API REST desarrollada con NestJS, TypeORM, PostgreSQL y JWT.
* `frontend_libreria/`: Cliente SPA desarrollado con Vue.js, Axios y Bootstrap.