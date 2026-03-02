# API Layer Conventions

## Placement Rules
- Keep all HTTP code in `src/api/`.
- Keep server-state cache in TanStack Query hooks (`queries/`, `mutations/`).
- Keep user choices and business rules in MobX managers (`src/state/**`).

## Folder Responsibilities
- `httpClient.ts`: shared axios instance + interceptors.
- `routes.ts`: endpoint paths and path builders.
- `services/*.ts`: raw API functions (no React hooks here).
- `queries/*.ts`: `useQuery` hooks.
- `mutations/*.ts`: `useMutation` hooks.

## Usage Pattern
1. Add endpoint in `routes.ts`.
2. Add request function in `services/*.ts`.
3. Expose `useQuery`/`useMutation` hook.
4. Consume hook in component.
5. Write selected value into MobX manager if that value is user state.

## Important Separation
- Do not store backend list responses in MobX.
- Use MobX only for selection/configuration state (size, buckle type, text, etc.).
