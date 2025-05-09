# UDV Friends WebApp

Aplicación web con múltiples capas para captar cambios en base de datos y notificar actualizaciones en tiempo real utilizando Socket.io.

## 🚀 Características

- Notificaciones en tiempo real con Socket.io
- Base de datos PostgreSQL con triggers
- API REST con Node.js y TypeScript
- Frontend en Angular
- Gestión de base de datos con pgAdmin

## 📋 Requisitos Previos

- Docker y Docker Compose
- Node.js (para desarrollo local)
- nppm (para desarrollo local)
- Angular CLI (para desarrollo local)

## 🏗️ Estructura del Proyecto

### 1. Base de Datos (PostgreSQL)

- Puerto: 5432
- Scripts de inicialización:
  - `scripts/friends_schema.sql`: Esquema de la base de datos
  - `scripts/friends_trigger.sql`: Triggers de la base de datos

### 2. Backend

- Puerto: 3000
- Tecnologías:
  - Node.js
  - TypeScript
  - Sequelize
  - Socket.io
  - Webpack

### 3. Frontend

- Puerto: 4200
- Tecnología: Angular

### 4. Gestor de Base de Datos (pgAdmin)

- Puerto: 8080
- Interfaz web para administración de PostgreSQL

## ⚙️ Configuración

### Variables de Entorno

1. En la raíz del proyecto:

   - Renombrar `.env.example` a `.env`
   - Configurar las variables necesarias

2. Para desarrollo local del backend:
   - En `UDV.Friends.Backend`:
   - Renombrar `.env.example` a `.env`
   - Configurar las variables necesarias

## 🚀 Ejecución

### Usando Docker (Recomendado)

#### Iniciar todos los servicios

```bash
docker-compose up -d
```

#### Iniciar servicios individuales

```bash
# Base de datos
docker-compose up -d postgres

# pgAdmin
docker-compose up -d pgadmin

# Backend
docker-compose up -d backend

# Frontend
docker-compose up -d frontend
```

#### Detener servicios

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### Desarrollo Local

#### Backend

```bash
cd UDV.Friends.Backend
pnpm install
npm run dev
```

#### Frontend

```bash
cd UDV.Friends.Frontend
npm install
ng serve
```

## 🌐 Acceso a los Servicios

| Servicio    | URL                   | Credenciales                                                             |
| ----------- | --------------------- | ------------------------------------------------------------------------ |
| Frontend    | http://localhost:4200 | -                                                                        |
| Backend API | http://localhost:3000 | -                                                                        |
| pgAdmin     | http://localhost:8080 | Email: ${PGADMIN_DEFAULT_EMAIL}<br>Password: ${PGADMIN_DEFAULT_PASSWORD} |

## 🔧 Solución de Problemas

### Ver logs de servicios

```bash
docker-compose logs [nombre_del_servicio]
```

### Reconstruir servicio

```bash
docker-compose up -d --build [nombre_del_servicio]
```

### Ver estado de contenedores

```bash
docker-compose ps
```

## 📝 Notas Adicionales

- La aplicación utiliza triggers de PostgreSQL para detectar cambios en la base de datos
- Socket.io se utiliza para la comunicación en tiempo real entre el backend y el frontend
- Los scripts SQL se ejecutan automáticamente al iniciar el contenedor de PostgreSQL
