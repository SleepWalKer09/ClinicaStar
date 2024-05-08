#  Sistema de Reservas para Pequeñas Empresas

## Objetivo del Proyecto

El objetivo principal de este proyecto es desarrollar e implementar un sistema de reservas online para la Clínica Star Platinum, que modernice y mejore la gestión de citas. Este sistema deberá ser intuitivo, fácil de usar tanto para clientes como para el personal de la clínica, y capaz de integrarse con las operaciones existentes de la clínica sin alterar la calidad del servicio. Además, buscará proporcionar funcionalidades como recordatorios automáticos de citas, una visión clara de la disponibilidad de especialistas y tratamientos, y una mejor gestión del tiempo y recursos de la clínica.

## Diseño de la Solución

### Arquitectura del Sistema

El sistema estará basado en una “web app” (software que se ejecuta en el navegador web), accesible tanto para clientes como para el personal administrativo y médico de la clínica. La arquitectura incluirá:

- **Frontend:** Interfaz de usuario intuitiva para la reserva, modificación y cancelación de citas. El frontend tendrá funcionalidades distintas dependiendo si el usuario es “Especialista” o “Paciente”.
- **Backend:** Servidor para procesar solicitudes, gestionar la base de datos de citas, y enviar recordatorios automáticos.
- **Base de Datos:** SQLite para almacenar información de usuarios, especialistas, citas, procedimientos y el historial clínico del paciente.
- **Modelado de Datos:** Se diseñará un esquema de base de datos relacional que capture las entidades principales (clientes, especialistas, citas, procedimientos y el historial clínico) y sus relaciones. Se utilizarán diagramas ER para visualizar la estructura de la base de datos.
- **Flujos de Usuario:** Se definirán flujos detallados para los roles de usuario (pacientes o especialistas/admin), cada uno con funcionalidades distintas.

  1. Pacientes:

  ![FlujoPacientes](https://github.com/SleepWalKer09/ClinicaStar/assets/44912298/787e7563-370b-4dc9-b961-b553dacf333d)

  2. Especialistas/Admin:

  ![FlujoEspecialistas](https://github.com/SleepWalKer09/ClinicaStar/assets/44912298/1985a805-ade7-4a3c-92c0-8cb20b69f43d)
     
- **Arquitectura:**

  ![Diagrama arquitectura](https://github.com/SleepWalKer09/ClinicaStar/assets/44912298/d197959c-faa0-46c6-88a0-04bfe6e37877)


# Ejecutar proyecto localmente
- Frontend: Desde la carpeta "clinica-frontend" ejecutas lo siguiente
```bash
npm install
npm start
```
Y la aplicación estará disponible en http://localhost:3000

* Backend: Desde la carpeta "clinica-backendDB" ejecutas lo siguiente
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
El servidor estará disponible en http://localhost:8000.

- Para el backend tambien puedes **compilar la imagen Docker:**
  1. Navega al directorio del proyecto donde está el Dockerfile:
```bash
cd ruta/al/directorio/del/proyecto
```
  2. Compila la imagen Docker:
     
Reemplaza nombre_de_la_imagen con el nombre que desees darle a tu imagen Docker.
```bash
docker build -t nombre_de_la_imagen .
```
  3. Ejecutar la imagen Docker
Ejecuta el contenedor Docker:
```bash
docker run -p 8000:8000 nombre_de_la_imagen
```
Esto ejecutará tu aplicación en el puerto 8000 dentro del contenedor Docker.
Ahora, para acceder a tu aplicación FastAPI desde el contenedor Docker, puedes usar la dirección http://localhost:8000 en tu navegador web o en tu cliente de API.
