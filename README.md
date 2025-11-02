# TFM-GameTracker
Game Tracker is a full-stack web app that lets users track, organize, and recommend video games. Built with Angular, NestJS, and PostgreSQL, it features personalized lists, affinity-based recommendations, and combined APIs to deliver a richer, user-focused gaming experience.

INSTALLATION INSTRUCTIONS (English)

Prerequisites

Install:

Node.js (v18 or higher)

npm (v9 or higher)

PostgreSQL (v15 or higher)

Angular CLI and Nest CLI (global):
npm install -g @angular/cli @nestjs/cli

Database Configuration

Start your PostgreSQL server.

Create a new database:
CREATE DATABASE gametracker;

Create a .env file inside the back-end folder with your credentials:

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=gametracker
JWT_SECRET=key

Backend Installation

cd back-end
npm install
npm run start:dev

The NestJS server will run at: http://localhost:3000

Frontend Installation

In another terminal:

cd front-end
npm install
npm start

The Angular application will run at: http://localhost:4200

Verification

Frontend: http://localhost:4200

Backend API: http://localhost:3000

Database: Local PostgreSQL (gametracker)





INSTRUCCIONES DE INSTALACIÓN (Español)

1. Requisitos previos

Instalar:

Node.js (v18 o superior)

npm (v9 o superior)

PostgreSQL (v15 o superior)

Angular CLI y Nest CLI (globales):

npm install -g @angular/cli @nestjs/cli

2. Configuración de la base de datos

Iniciar el servidor PostgreSQL.

Crear una base de datos:

CREATE DATABASE gametracker;


Crear un archivo .env en la carpeta back-end con tus credenciales:

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=contraseña
DATABASE_NAME=gametracker
JWT_SECRET=key

3. Instalación del backend
cd back-end
npm install
npm run start:dev

El servidor NestJS se ejecuta en http://localhost:3000

4. Instalación del frontend

En otra terminal:

cd front-end
npm install
npm start

La aplicación Angular se ejecuta en http://localhost:4200

5. Comprobación

Frontend: http://localhost:4200

Backend API: http://localhost:3000

Base de datos: PostgreSQL local (gametracker)