<div align="center">

```
██████╗  █████╗ ██╗     ██╗  ██╗   ██╗
██╔══██╗██╔══██╗██║     ██║  ╚██╗ ██╔╝
██████╔╝███████║██║     ██║   ╚████╔╝
██╔══██╗██╔══██║██║     ██║    ╚██╔╝
██║  ██║██║  ██║███████╗███████╗██║
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝
 ISLAS CANARIAS 2026 — REST API
```

**API REST para la gestión del Rally Islas Canarias 2026**  
Etapas · Tramos · Pilotos · Equipos

---

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.6-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-API_Key-6DB33F?style=flat-square&logo=springsecurity&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?style=flat-square&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render&logoColor=white)

</div>

---

## 📐 Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (HTTP)                        │
│              Postman · Browser · Frontend                │
└──────────────────────────┬──────────────────────────────┘
                           │  GET (público) / POST·PUT·DELETE (X-API-Key)
┌──────────────────────────▼──────────────────────────────┐
│              SPRING SECURITY — ApiKeyFilter              │
└──────────────────────────┬──────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
  EquipoController   PilotoController   EtapaController
  TramoController    ─────────────────────────────────
        │                  │                  │
        ▼                  ▼                  ▼
  EquipoService      PilotoService      EtapaService
  TramoService       ─────────────────────────────────
        │                  │                  │
        ▼                  ▼                  ▼
  EquipoRepository   PilotoRepository   EtapaRepository
  TramoRepository    ─ Spring Data JPA ────────────────
        │                  │                  │
        └──────────────────▼──────────────────┘
                   PostgreSQL (Neon)
```

---

## 🗂️ Modelo de dominio

```
┌──────────────────┐        ┌──────────────────────────────┐
│     EQUIPO       │        │           PILOTO              │
├──────────────────┤  1   N ├──────────────────────────────┤
│ id               │◄───────│ id                           │
│ nombre           │        │ nombre                       │
│ nacionalidad     │        │ dorsal  (UNIQUE)             │
│ marca            │        │ nacionalidad                 │
│ anioFundacion    │        │ categoria                    │
└──────────────────┘        │ activo  (Boolean)            │
                            │ equipo_id  FK ───────────────┘
                            └──────────────┬───────────────
                                           │ N
                                    tramo_piloto
                                      (join table)
                                           │ N
                            ┌──────────────▼───────────────┐
                            │           TRAMO              │
                            ├──────────────────────────────┤
                            │ id                           │
                            │ nombre                       │
                            │ distanciaKm  NUMERIC(6,2)    │
                            │ dificultad   Enum            │
                            │ superficie   Enum            │
                            │ isla         Enum            │
                            │ etapa_id  FK ────────────────┐
                            └──────────────────────────────┘
                                                           │ N·1
                            ┌──────────────────────────────▼──┐
                            │            ETAPA                │
                            ├─────────────────────────────────┤
                            │ id                              │
                            │ nombre                          │
                            │ descripcion                     │
                            │ fecha                           │
                            │ isla  Enum                      │
                            └─────────────────────────────────┘
```

---

## 🛠️ Stack tecnológico

| Capa | Tecnología | Detalle |
|------|------------|---------|
| 🟠 Lenguaje | **Java 17** | LTS · Records · Sealed classes |
| 🟢 Framework | **Spring Boot 3.4.6** | Auto-config · Embedded Tomcat |
| 🗄️ Persistencia | **Spring Data JPA + Hibernate 6** | `ddl-auto=update` · `show-sql=true` |
| 🐘 Base de datos prod | **PostgreSQL 17** (Neon cloud) | Serverless · Connection pooling |
| 💾 Base de datos test | **H2** | En memoria · Levanta sin config |
| 🔒 Seguridad | **Spring Security 6 + ApiKeyFilter** | Stateless · GET público · escritura protegida |
| 🌐 Frontend | **HTML + Vanilla JS** | `static/` · Fetch API · Sin dependencias |
| 🐳 Contenedores | **Docker** (multi-stage build) | JDK build → JRE runtime |
| ☁️ Deploy | **Render** | Auto-deploy desde GitHub |

---

## 🔌 Endpoints de la API

> **Autenticación:** Los `GET` son públicos. `POST`, `PUT` y `DELETE` requieren el header:
> ```
> X-API-Key: <tu-api-key>
> ```

<details>
<summary><b>🏎️ Equipos</b> — <code>/api/equipos</code></summary>

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/equipos` | Listar todos los equipos | — |
| `GET` | `/api/equipos/{id}` | Obtener equipo por ID → `404` si no existe | — |
| `GET` | `/api/equipos/buscar?nombre=` | Buscar por nombre (parcial, sin parámetro = todos) | — |
| `GET` | `/api/equipos/nacionalidad?nacionalidad=` | Filtrar por nacionalidad | — |
| `GET` | `/api/equipos/{id}/pilotos/count` | Número de pilotos del equipo | — |
| `POST` | `/api/equipos` | Crear equipo | 🔑 |
| `PUT` | `/api/equipos/{id}` | Actualizar equipo → `404` si no existe | 🔑 |
| `DELETE` | `/api/equipos/{id}` | Eliminar equipo → `204` / `404` | 🔑 |

</details>

<details>
<summary><b>👤 Pilotos</b> — <code>/api/pilotos</code></summary>

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/pilotos` | Listar todos los pilotos | — |
| `GET` | `/api/pilotos/{id}` | Obtener piloto por ID → `404` si no existe | — |
| `GET` | `/api/pilotos/equipo/{equipoId}` | Pilotos de un equipo | — |
| `GET` | `/api/pilotos/activos` | Pilotos con `activo = true` | — |
| `GET` | `/api/pilotos/buscar?nombre=&sort=&direction=` | Buscar por nombre con ordenación dinámica | — |
| `POST` | `/api/pilotos` | Crear piloto | 🔑 |
| `PUT` | `/api/pilotos/{id}` | Actualizar piloto | 🔑 |
| `DELETE` | `/api/pilotos/{id}` | Eliminar piloto → `204` / `404` | 🔑 |

</details>

<details>
<summary><b>🗺️ Etapas</b> — <code>/api/etapas</code></summary>

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/etapas` | Listar todas las etapas | — |
| `GET` | `/api/etapas/{id}` | Obtener etapa por ID → `404` si no existe | — |
| `POST` | `/api/etapas` | Crear etapa | 🔑 |
| `PUT` | `/api/etapas/{id}` | Actualizar etapa | 🔑 |
| `DELETE` | `/api/etapas/{id}` | Eliminar etapa → `204` / `404` | 🔑 |

</details>

<details>
<summary><b>🛣️ Tramos</b> — <code>/api/tramos</code></summary>

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/tramos` | Listar todos los tramos | — |
| `GET` | `/api/tramos/{id}` | Obtener tramo por ID → `404` si no existe | — |
| `GET` | `/api/tramos/buscar?nombre=` | Buscar por nombre (sin parámetro = todos) | — |
| `POST` | `/api/tramos` | Crear tramo | 🔑 |
| `PUT` | `/api/tramos/{id}` | Actualizar tramo | 🔑 |
| `DELETE` | `/api/tramos/{id}` | Eliminar tramo → `204` / `404` | 🔑 |
| `POST` | `/api/tramos/{tramoId}/pilotos/{pilotoId}` | Inscribir piloto en tramo | 🔑 |
| `DELETE` | `/api/tramos/{tramoId}/pilotos/{pilotoId}` | Desinscribir piloto de tramo | 🔑 |

</details>

---

## 🚀 Ejecución local

### Requisitos

- **Java 17+**
- **Maven 3.8+** (o el wrapper `./mvnw` incluido)
- **PostgreSQL** local o acceso a una instancia cloud (Neon, Supabase, etc.)

### 1 · Clonar y configurar

```bash
git clone https://github.com/Haise232/rally-canarias.git
cd rally-canarias
```

Edita `src/main/resources/application.properties` con tus credenciales:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/rally_canarias
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
api.key=tu_clave_secreta
```

### 2 · Arrancar

```bash
./mvnw spring-boot:run
```

La API levanta en **`http://localhost:8080`**  
El frontend está disponible en **`http://localhost:8080/index.html`**

### 3 · Probar con Postman

```
# Lectura — sin autenticación
GET http://localhost:8080/api/tramos

# Escritura — con API Key
POST http://localhost:8080/api/equipos
Header: X-API-Key: tu_clave_secreta
Body (JSON):
{
  "nombre": "Canarias Motor Sport",
  "nacionalidad": "ES",
  "marca": "Hyundai",
  "anioFundacion": 2018
}
```

### 🐳 Alternativa: Docker

```bash
docker build -t rally-canarias .

docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/rally_canarias \
  -e SPRING_DATASOURCE_USERNAME=tu_usuario \
  -e SPRING_DATASOURCE_PASSWORD=tu_contraseña \
  -e API_KEY=tu_clave_secreta \
  rally-canarias
```

---

## 🔒 Seguridad

La autenticación funciona mediante un **filtro personalizado** (`ApiKeyFilter`) que extiende `OncePerRequestFilter`:

```
Petición entrante
       │
       ▼
  ¿Método GET?  ──── Sí ──▶  bypassa el filtro → Spring Security: permitAll()
       │
       No
       │
       ▼
  Lee header X-API-Key
       │
  ┌────┴────┐
  │  ¿Key   │
  │ válida? │
  └────┬────┘
       │ Sí                   No
       ▼                       ▼
  Setea autenticación    HTTP 401
  en SecurityContext     {"error": "API Key inválida o ausente"}
       │
       ▼
  Continúa la cadena → Controller
```

---

## 📦 Estructura del proyecto

```
rally-canarias/
├── src/
│   ├── main/
│   │   ├── java/com/rally/canarias/
│   │   │   ├── CanariasApplication.java
│   │   │   ├── controller/          ← @RestController · rutas HTTP
│   │   │   │   ├── EquipoController.java
│   │   │   │   ├── PilotoController.java
│   │   │   │   ├── EtapaController.java
│   │   │   │   └── TramoController.java
│   │   │   ├── service/             ← @Service · lógica de negocio
│   │   │   │   ├── EquipoService.java
│   │   │   │   ├── PilotoService.java
│   │   │   │   ├── EtapaService.java
│   │   │   │   └── TramoService.java
│   │   │   ├── repository/          ← JpaRepository · acceso a datos
│   │   │   │   ├── EquipoRepository.java
│   │   │   │   ├── PilotoRepository.java
│   │   │   │   ├── EtapaRepository.java
│   │   │   │   └── TramoRepository.java
│   │   │   ├── entity/              ← @Entity · modelo JPA
│   │   │   │   ├── Equipo.java
│   │   │   │   ├── Piloto.java
│   │   │   │   ├── Etapa.java
│   │   │   │   ├── Tramo.java
│   │   │   │   ├── Isla.java        (enum)
│   │   │   │   ├── Dificultad.java  (enum)
│   │   │   │   ├── Superficie.java  (enum)
│   │   │   │   ├── IslaConverter.java
│   │   │   │   ├── DificultadConverter.java
│   │   │   │   └── SuperficieConverter.java
│   │   │   ├── security/            ← Spring Security
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── ApiKeyFilter.java
│   │   │   └── exception/
│   │   │       └── GlobalExceptionHandler.java  ← @RestControllerAdvice
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/              ← Frontend (HTML + CSS + JS)
│   │           ├── index.html
│   │           ├── css/styles.css
│   │           └── js/app.js
├── Dockerfile
├── pom.xml
└── README.md
```

---

## 🧪 Tests

```bash
./mvnw test
```

> Los tests usan H2 en memoria — no requieren PostgreSQL instalado.

---

## ☁️ Despliegue en Render

1. Conectar el repositorio en [render.com](https://render.com) como **Web Service**
2. Seleccionar **Docker** como entorno de ejecución
3. Configurar variables de entorno:

| Variable | Descripción |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<host>/neondb?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Usuario de PostgreSQL |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña de PostgreSQL |
| `API_KEY` | Clave de autenticación de la API |

> `PORT` es asignada automáticamente por Render y la aplicación la consume con `${PORT:8080}`.

---

## 👥 Autores

<table>
<tr>
<td align="center">
<b>Izel Correa Baena</b><br>
<a href="https://github.com/IzelCorreaBaena">@IzelCorreaBaena</a>
</td>
<td align="center">
<b>Joaquín José</b><br>
<a href="https://github.com/Haise232">@Haise232</a>
</td>
</tr>
</table>

---

<div align="center">
<sub>Rally Islas Canarias 2026 · UT6 Actividad de Evaluación Final · DAM</sub>
</div>
