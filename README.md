# Visit Sri Lanka — Monorepo

```
visit-sri-lanka/
├── frontend/   # Next.js 15 website — active, Phase 0 complete
└── backend/    # Spring Boot API — placeholder skeleton, Phase 3+
```

## Frontend (active now)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

See `frontend/README.md` for full details on the design tokens, folder
structure, and shadcn/ui setup.

## Backend (placeholder for later)

```bash
cd backend
mvn spring-boot:run
```

See `backend/README.md` — this is intentionally minimal right now. The
frontend does not call it yet; it exists so the folder/package structure is
in place before Phase 3 development starts.

## Documentation

Full docs live in `docs/`:
- `docs/architecture.md` — current structure, data flow, and an honest
  list of what's built vs. still planned
- `docs/database.md` — MongoDB collection schemas
- `docs/api.md` — internal service layer + planned Spring Boot endpoints
- `docs/deployment.md` — Vercel + MongoDB Atlas production checklist


## Why split now instead of later

Keeping `frontend/` and `backend/` as siblings from day one means:
- Each can be deployed independently (Vercel for frontend, any JVM host for
  backend) without restructuring later
- Git history, CI pipelines, and IDE workspaces can target either project
  cleanly
- The Android app (Phase 3 of the overall product roadmap) will eventually
  sit as a third sibling folder, consuming the same backend API as the
  website
