# Rally Canarias API

REST API para la gestión de un rally automovilístico en las Islas Canarias. Permite administrar etapas, tramos, pilotos y equipos, con autenticación por API Key y despliegue en la nube.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Lenguaje | Java 17 |
| Framework | Spring Boot 3.4.6 |
| Persistencia | Spring Data JPA + Hibernate |
| Base de datos (prod) | PostgreSQL (Neon) |
| Base de datos (test) | H2 (en memoria) |
| Seguridad | Spring Security + API Key Filter |
| Contenerización | Docker (multi-stage build) |
| Despliegue | Render |

## Modelo de dominio

```
Equipo (1) ──────────── (N) Piloto
                              │
                        (N)   │   (N)
                           Tramo ──── tramo_piloto (join table)
                              │
                        (N)   │   (1)
                           Etapa
```

### Entidades

- **Equipo** — nombre, nacionalidad, marca, año de fundación
- **Piloto** — nombre, dorsal (único), nacionalidad, categoría, activo/inactivo, equipo
- **Etapa** — nombre, descripción, fecha, isla (`Isla` enum)
- **Tramo** — nombre, distancia (km), dificultad, superficie, isla, etapa, pilotos inscritos

### Enumeraciones

| Enum | Valores |
|---|---|
| `Isla` | `GRAN_CANARIA`, `TENERIFE`, `LA_PALMA`, `LA_GOMERA`, `EL_HIERRO`, `FUERTEVENTURA`, `LANZAROTE` |
| `Dificultad` | `FACIL`, `MEDIA`, `DIFICIL` |
| `Superficie` | `Tierra`, `Asfalto`, `Hierba`, `Barro`, `Nieve`, `Hielo`, `Arena` |

## Endpoints de la API

Todas las rutas de escritura (`POST`, `PUT`, `DELETE`) requieren el header `X-API-Key`.

### Equipos — `/api/equipos`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/equipos` | Listar todos los equipos |
| `GET` | `/api/equipos/{id}` | Obtener equipo por ID |
| `GET` | `/api/equipos/buscar?nombre=` | Buscar por nombre (parcial) |
| `GET` | `/api/equipos/nacionalidad?nacionalidad=` | Filtrar por nacionalidad |
| `GET` | `/api/equipos/{id}/pilotos/count` | Contar pilotos de un equipo |
| `POST` | `/api/equipos` | Crear equipo |
| `PUT` | `/api/equipos/{id}` | Actualizar equipo |
| `DELETE` | `/api/equipos/{id}` | Eliminar equipo |

### Pilotos — `/api/pilotos`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/pilotos` | Listar todos los pilotos |
| `GET` | `/api/pilotos/{id}` | Obtener piloto por ID |
| `GET` | `/api/pilotos/equipo/{equipoId}` | Pilotos de un equipo |
| `GET` | `/api/pilotos/activos` | Pilotos activos |
| `GET` | `/api/pilotos/buscar?nombre=&sort=&direction=` | Buscar por nombre con ordenación |
| `POST` | `/api/pilotos` | Crear piloto |
| `PUT` | `/api/pilotos/{id}` | Actualizar piloto |
| `DELETE` | `/api/pilotos/{id}` | Eliminar piloto |

### Etapas — `/api/v1/etapas`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/etapas` | Listar todas las etapas |
| `GET` | `/api/v1/etapas/{id}` | Obtener etapa por ID |
| `POST` | `/api/v1/etapas` | Crear etapa |
| `PUT` | `/api/v1/etapas/{id}` | Actualizar etapa |
| `DELETE` | `/api/v1/etapas/{id}` | Eliminar etapa |

### Tramos — `/api/v1/tramos`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/tramos` | Listar todos los tramos |
| `GET` | `/api/v1/tramos/{id}` | Obtener tramo por ID |
| `GET` | `/api/v1/tramos/buscar?nombre=` | Buscar por nombre |
| `POST` | `/api/v1/tramos` | Crear tramo |
| `PUT` | `/api/v1/tramos/{id}` | Actualizar tramo |
| `DELETE` | `/api/v1/tramos/{id}` | Eliminar tramo |
| `POST` | `/api/v1/tramos/{tramoId}/pilotos/{pilotoId}` | Inscribir piloto en tramo |
| `DELETE` | `/api/v1/tramos/{tramoId}/pilotos/{pilotoId}` | Desinscribir piloto de tramo |

## Autenticación

La API utiliza autenticación por API Key. Las peticiones de lectura (`GET`) son públicas. Las operaciones de escritura requieren el header:

```
X-API-Key: <tu-api-key>
```

La clave se configura mediante la variable de entorno `API_KEY`.

## Ejecución local

### Prerequisitos

- Java 17+
- Maven 3.8+ (o usar el wrapper incluido `./mvnw`)
- PostgreSQL o Docker

### Variables de entorno

Crea un archivo `.env` o configura las siguientes variables:

```env
PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/rally_canarias
SPRING_DATASOURCE_USERNAME=tu_usuario
SPRING_DATASOURCE_PASSWORD=tu_contraseña
API_KEY=tu_clave_secreta
```

### Arrancar con Maven

```bash
./mvnw spring-boot:run
```

### Arrancar con Docker

```bash
# Construir imagen
docker build -t rally-canarias .

# Ejecutar contenedor
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/rally_canarias \
  -e SPRING_DATASOURCE_USERNAME=tu_usuario \
  -e SPRING_DATASOURCE_PASSWORD=tu_contraseña \
  -e API_KEY=tu_clave_secreta \
  rally-canarias
```

La API estará disponible en `http://localhost:8080`.

## Tests

```bash
./mvnw test
```

Los tests usan H2 en memoria, no requieren una instancia de PostgreSQL.

## Despliegue en Render

El proyecto está configurado para desplegarse en [Render](https://render.com):

1. Conectar el repositorio en Render como **Web Service**.
2. Seleccionar **Docker** como entorno de ejecución.
3. Configurar las siguientes variables de entorno en el dashboard de Render:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | URL de conexión a Neon PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | Usuario de base de datos |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña de base de datos |
| `API_KEY` | Clave de autenticación de la API |

Render asigna automáticamente la variable `PORT`, que la aplicación y el Dockerfile ya consumen.

## Estructura del proyecto

```
src/main/java/com/rally/canarias/
├── CanariasApplication.java
├── controller/
│   ├── EquipoController.java
│   ├── PilotoController.java
│   ├── EtapaController.java
│   └── TramoController.java
├── service/
│   ├── EquipoService.java
│   ├── PilotoService.java
│   ├── EtapaService.java
│   └── TramoService.java
├── repository/
│   ├── EquipoRepository.java
│   ├── PilotoRepository.java
│   ├── EtapaRepository.java
│   └── TramoRepository.java
├── entity/
│   ├── Equipo.java
│   ├── Piloto.java
│   ├── Etapa.java
│   ├── Tramo.java
│   ├── Isla.java
│   ├── Dificultad.java
│   └── Superficie.java
└── security/
    ├── SecurityConfig.java
    └── ApiKeyFilter.java
```

## Autores

- **Izel Correa Baena** — [@IzelCorreaBaena](https://github.com/IzelCorreaBaena)
- **Haise232** — [@Haise232](https://github.com/Haise232)
