# Visit Sri Lanka — Backend API (placeholder)

This is a **reserved skeleton** for the future Spring Boot REST API described
in the Architecture doc (Phase 3+). It is not part of the current build
phase — the website runs entirely on mock JSON in `frontend/src/data/` for
now via the `lib/api/` abstraction layer.

## What's here
- Standard Maven/Spring Boot project layout
- `VisitSriLankaApiApplication.java` — boots the app
- `HealthController` — a single `/api/health` endpoint, just to confirm the
  server runs and the frontend can reach it in local dev
- Empty `controller/ service/ repository/ model/ dto/ config/ exception/`
  packages, mirroring the layered architecture planned for Phase 3
- `application.properties` — placeholder PostgreSQL/Supabase connection
  settings and local CORS config for `http://localhost:3000`

## Requirements to actually run this
- Java 21 (matches `pom.xml`)
- Maven (or use an IDE like IntelliJ that manages it for you)
- A PostgreSQL instance if you want anything beyond `/api/health` — none is
  needed yet since no entities/repositories exist

## Run it

```bash
cd backend
mvn spring-boot:run
```

Then check:

```bash
curl http://localhost:8080/api/health
```

## When to actually build this out
Per the roadmap, this stays a placeholder until Phase 3 (Trip Planner /
Budget Calculator need real persistence) or Phase 9 (Supabase integration).
Building it earlier than that means maintaining two data sources in
parallel for no benefit — the frontend's `lib/api/` abstraction exists
specifically so this swap-in can happen later without touching UI code.
