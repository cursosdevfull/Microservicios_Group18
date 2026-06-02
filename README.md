# Microservicios_Group18

## Arquitectura de microservicios

Revisión del monorepo en `project/apps`:

- `gateway` (`3000`): punto de entrada HTTP. Deriva operaciones hacia `enrich`, `patient` y `auth`.
- `discovery` (`3050`): registro de servicios, resolución por nombre, heartbeats y health checks.
- `enrich` (`3060`): agrega el `countryISO` y protege la llamada a `appointment` con circuit breaker.
- `appointment` (`3010`): orquestador de citas. Resuelve un servicio regional de `appointment` y luego notifica a `salesforce`.
- `appointment-cl` (`3020`), `appointment-co` (`3030`), `appointment-pe` (`3040`): implementaciones regionales del endpoint de citas.
- `patient` (`3070`): alta de pacientes, login y refresh token. Persiste en MySQL.
- `auth` (`3080`): fachada de autenticación; delega login y refresh token al servicio `patient`.
- `salesforce` (`3090`): endpoint de integración externa para registrar el evento posterior a la cita.

```mermaid
flowchart LR
	client[Cliente / Consumer]
	mysql[(MySQL)]

	subgraph entry[Entrada]
		gateway[gateway\n:3000]
	end

	subgraph registry[Service Registry]
		discovery[discovery\n:3050]
	end

	subgraph core[Flujo principal de citas]
		enrich[enrich\n:3060\nCircuit Breaker]
		appointment[appointment\n:3010\nOrquestador]
		appointmentCl[appointment-cl\n:3020]
		appointmentCo[appointment-co\n:3030]
		appointmentPe[appointment-pe\n:3040]
		salesforce[salesforce\n:3090]
	end

	subgraph identity[Pacientes y autenticacion]
		auth[auth\n:3080]
		patient[patient\n:3070]
	end

	client -->|POST /api/v1/appointment| gateway
	client -->|POST /api/v1/patient| gateway
	client -->|POST /api/v1/auth/*| gateway

	gateway -->|resuelve enrich| discovery
	gateway -->|POST /enrich| enrich
	gateway -->|resuelve patient| discovery
	gateway -->|POST /patient| patient
	gateway -->|resuelve auth| discovery
	gateway -->|POST /auth/login\nPOST /auth/get-new-access-token| auth

	enrich -->|resuelve appointment| discovery
	enrich -->|POST /appointment + countryISO| appointment

	appointment -->|resuelve appointment-ISO| discovery
	appointment --> appointmentCl
	appointment --> appointmentCo
	appointment --> appointmentPe
	appointment -->|resuelve salesforce-ISO\nsegun el codigo| discovery
	appointment -->|POST /salesforce| salesforce

	auth -->|resuelve patient| discovery
	auth -->|login / refresh| patient
	patient --> mysql

	discovery -. registro .-> gateway
	discovery -. registro .-> enrich
	discovery -. registro .-> appointment
	discovery -. registro .-> appointmentCl
	discovery -. registro .-> appointmentCo
	discovery -. registro .-> appointmentPe
	discovery -. registro .-> auth
	discovery -. registro .-> patient
	discovery -. registro .-> salesforce
```

## Observaciones de la revisión

- Todos los servicios, salvo `discovery`, se registran en `discovery` al iniciar y envían heartbeat periódico.
- `patient` es el único microservicio con dependencia directa de base de datos; usa MySQL configurado en `project/compose.yml`.
- `appointment` selecciona el destino regional usando `countryISO` (`CL`, `CO`, `PE`).
- Hay una discrepancia en el código actual: `appointment` intenta resolver `salesforce-{iso}` en `discovery`, pero en el repositorio sólo existe un microservicio `salesforce` y su `.env` registra el nombre `salesforce`.
