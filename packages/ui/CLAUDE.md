# CLAUDE.md - Shared UI Component Workspace Guidelines

Guidelines for building and maintaining shared React components in `@perflens/ui`.

## 📐 Conventions & Rules

- **Framework Agnostic UI**: Keep components focused on UI layout and presentation. Avoid hardcoding application-specific API queries inside shared UI components.
- **Styling**: Standardize on Tailwind CSS styling consistent with `apps/web`.
- **Exports**: Export all reusable component primitives from `src/index.tsx`.
- **React 19 Compatibility**: Ensure components support React 19 functional component patterns without relying on deprecated lifecycle APIs.
