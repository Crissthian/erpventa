<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ERPVenta - Agent Instructions

## Stack

- Next.js 16.2.9 (App Router, Turbopack default)
- React 19.2.4, shadcn/ui 4.11.0 (base-lyra style)
- SQL Server (mssql/tedious driver, sin ORM)
- Zod validation, JWT auth (jose), bcryptjs
- Docker Compose for all services
- pnpm 11.7.0 package manager
- Tailwind CSS 4, Phosphor Icons

## Next.js 16 Breaking Changes (CRITICAL)

- **NO `middleware.ts`** → use `proxy.ts` with `export function proxy(request)`, nodejs runtime only
- **Async APIs mandatory**: `await cookies()`, `await headers()`, `await params`, `await searchParams`
- **`revalidateTag` requires cacheLife**: `revalidateTag('tag', 'max')` not `revalidateTag('tag')`
- **`updateTag`**: new Server Action API for read-your-writes semantics
- **Turbopack default**: no `--turbopack` flag needed
- **`next lint` removed**: use `pnpm lint` (ESLint CLI)

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm lint:fix     # ESLint auto-fix
pnpm format       # Prettier write
pnpm format:check # Prettier check
```

Always run `pnpm lint` and `pnpm format:check` after making changes.

## Architecture (Clean Architecture)

```
Presentation (app/, components/)
  → Use Cases (lib/use-cases/)
    → Services (lib/services/)
      → Repositories (lib/repositories/)
        → Database (SQL Server)
```

## File Conventions

| Type              | Location                                          |
| ----------------- | ------------------------------------------------- |
| Pages             | `app/(dashboard)/module/page.tsx`                 |
| Server Actions    | `actions/module.actions.ts` (with `'use server'`) |
| Use Cases         | `lib/use-cases/module/`                           |
| Services          | `lib/services/module.service.ts`                  |
| Repositories      | `lib/repositories/module.repository.ts`           |
| Validators        | `lib/validators/module.schema.ts` (Zod schemas)   |
| UI Components     | `components/ui/` (shadcn only)                    |
| Module Components | `components/modules/module/`                      |
| Layout Components | `components/layout/`                              |
| Shared Components | `components/shared/`                              |
| Hooks             | `hooks/`                                          |

## Key Patterns

- **Server Actions**: always validate with Zod, call use-case, revalidate with `revalidateTag`
- **Auth guard**: `await requirePermission('x.read')` at top of page/action
- **Audit**: log all CRUD via `auditService.log()` in use-cases
- **Sessions**: JWT tokens stored in HTTP-only cookie, 7-day expiration
- **DB singleton**: `lib/db/client.ts` (mssql pool)
- **No comments in code** unless explicitly requested (see Comment Guidelines below)

## Comment Guidelines

All comments must be written in **Spanish**. Follow these best practices:

### When to comment

- **Logica compleja no obvia**: explicar el "por que", no el "que"
- **Workarounds y hacks**: justificar por que existe y cuando se puede remover
- **Decisiones de negocio**: reglas que no son evidentes desde el codigo
- **TODOs pendientes**: usar formato `// TODO: descripcion`
- **Advertencias de seguridad**: operaciones sensibles, manejo de datos criticos

### When NOT to comment

- Codigo autoexplicativo (nombres de variables/funciones claros)
- Comentarios que solo repiten lo que dice el codigo
- Comentarios obsoletos o desactualizados (peor que no tener comentarios)
- Bloques de codigo comentado (usar git history en su lugar)
- Separadores visuales o decorativos

### Format

```typescript
// JSDoc para funciones publicas de servicios y repositorios
/**
 * Calcula el saldo pendiente de un cliente.
 * Incluye ventas a credito vencidas y por vencer.
 */
export async function getAccountBalance(clientId: string): Promise<number> { ... }

// Inline: solo cuando el "por que" no es obvio
// Se usa transaccion para evitar stock negativo en ventas concurrentes
const transaction = new sql.Transaction(pool)
await transaction.begin()

// TODO: formato estandar
// TODO: migrar a cola de trabajos cuando se implemente BullMQ
```

### Rules

- Tono: directo, tecnico, sin relleno
- Maximo 2-3 lineas por comentario inline
- JSDoc solo en funciones publicas exportadas de `lib/services/` y `lib/repositories/`
- Nunca comentar Server Actions ni componentes UI (salvo logica no obvia)
- Actualizar o eliminar comentarios cuando se modifica el codigo relacionado

## Documentation

Full implementation guide: `docs/erp-guide.md` and `docs/phase-XX-*.md`
