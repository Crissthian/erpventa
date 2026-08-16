# ERPVenta

ERPVenta es un sistema de planificación de recursos empresariales (ERP) enfocado en ventas, diseñado para ser rápido, modular y altamente eficiente.

## Stack Tecnológico

- **Framework**: Next.js 16.2.9 (App Router) & React 19
- **Estilos**: Tailwind CSS v4 & shadcn/ui
- **Iconografía**: Phosphor Icons (v2.1.10)
- **Base de Datos**: SQL Server (consultas nativas sin ORM)
- **Validación**: Zod
- **Autenticación**: JWT (`jose`) & bcryptjs
- **Entorno**: Docker Compose & pnpm

## Arquitectura del Proyecto (Patrón Hexagonal)

El backend de **ERPVenta** está estructurado siguiendo el **Patrón Hexagonal** (también conocido como _Puertos y Adaptadores_) y organizado por **Contextos Delimitados (Bounded Contexts)** o módulos de negocio. Esto aísla la lógica empresarial central de los detalles tecnológicos como frameworks, bases de datos (SQL Server) o protocolos de comunicación.

### Flujo de Peticiones:

```text
[Driving Adapters]                  [Application Core]                [Driven Adapters]
Presentation (Páginas App) ───┐
                              ├─► Use Cases (Application) ────► Repositories (SQL Server)
Server Actions (Acciones) ────┘          │
                                         ▼
                                  Domain (Entities)
```

### Estructura de Directorios en `lib/`

Cada módulo de negocio (como `ventas`, `inventario`, `configuracion`) está autocontenido dentro de su respectivo directorio y consta de las siguientes capas:

1. **Domain (Núcleo de Dominio)**:
   - Contiene la lógica del negocio pura: **Entidades**, **Value Objects** y las definiciones de los contratos o **Puertos de Salida** (Interfaces de Repositorios).
   - _No depende de ninguna tecnología ni librería externa_ (como React, Next.js, drivers SQL, etc.).
   - Rutas ejemplo:
     - `lib/<modulo>/domain/entities/`: Definición de modelos de negocio e invariantes.
     - `lib/<modulo>/domain/ports/`: Interfaces que definen los puertos de salida (ej. `VentaRepository`).

2. **Application (Capa de Aplicación)**:
   - Contiene los **Casos de Uso** (Driving Ports) que coordinan los flujos de trabajo de la aplicación y aplican reglas de negocio de alto nivel.
   - Depende únicamente de la capa de _Domain_.
   - Ruta ejemplo: `lib/<modulo>/application/use-cases/`.

3. **Infrastructure (Capa de Infraestructura)**:
   - Contiene los **Adaptadores de Salida (Driven Adapters)**, es decir, las implementaciones técnicas de los puertos definidos en el Dominio.
   - En este ERP, contiene los repositorios concretos que realizan consultas SQL Server nativas (sin ORM) utilizando el pool de conexiones central.
   - Depende de _Domain_ y _Application_.
   - Ruta ejemplo: `lib/<modulo>/infrastructure/adapters/`.

4. **Core Compartido (`lib/core/`)**:
   - Contiene la infraestructura transversal del ERP, tales como el cliente de base de datos (`lib/core/infrastructure/db/client.ts`), logger de auditoría y utilidades globales.

## Agentes de IA y Asistentes de Código

Este repositorio está optimizado para su uso con agentes de IA (como Antigravity, OpenCode y otros). Las reglas y directrices de desarrollo están configuradas en el directorio raíz de personalizaciones:

- **Instrucciones generales**: [AGENTS.md](file:///home/crissthian/Documentos/TRABAJO/erpventa/AGENTS.md)
- **Skills del Workspace**: Ubicadas en `.agents/skills/`
  - **[erpventa-nextjs16-core](file:///home/crissthian/Documentos/TRABAJO/erpventa/.agents/skills/erpventa-nextjs16-core/SKILL.md)**: Reglas de Next.js 16 y convenciones del backend.
  - **[erpventa-nextjs16-best-practices](file:///home/crissthian/Documentos/TRABAJO/erpventa/.agents/skills/erpventa-nextjs16-best-practices/SKILL.md)**: Guía de buenas prácticas de desarrollo.
  - **[erpventa-ui-odoo](file:///home/crissthian/Documentos/TRABAJO/erpventa/.agents/skills/erpventa-ui-odoo/SKILL.md)**: Guía de estilos UI y maquetación de componentes inspirados en Odoo.

## Comandos Útiles

Ejecuta las siguientes tareas de validación y formateo antes de realizar confirmaciones de código:

```bash
pnpm dev          # Iniciar servidor de desarrollo con Turbopack
pnpm build        # Compilar la aplicación para producción
pnpm lint         # Ejecutar el linter estático (ESLint)
pnpm lint:fix     # Corregir errores automáticos de linting
pnpm format       # Formatear el código con Prettier
pnpm format:check # Comprobar el formato sin aplicar cambios
```
