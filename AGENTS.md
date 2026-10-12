# Psyke Frontend

Sistema de gestão para clínicas de psicologia (Clinic OS).

## Stack

| Camada | Tecnologia | Observação |
|---|---|---|
| Framework | React 19 | Functional components + hooks |
| Build | Vite 8 | @vitejs/plugin-react |
| Linguagem | TypeScript 6 | strict mode, verbatimModuleSyntax |
| Estilos | Tailwind CSS 3 + CSS Variables | Design tokens via `var(--*)` |
| Roteamento | React Router 7 | createBrowserRouter + lazy() |
| Estado global | Zustand 5 | persist middleware |
| Server state | TanStack Query 5 | queryClient centralizado |
| Formulários | react-hook-form 7 + zod | @hookform/resolvers |
| Ícones | lucide-react | |
| Datas | date-fns 4 | |
| Gráficos | recharts | |
| Tabelas | @tanstack/react-table | |
| Calendário | @fullcalendar (react, daygrid, timegrid, interaction) | |
| UI | Radix UI (Dialog, Dropdown, Tabs) | |
| HTTP | axios | Interceptors para auth + refresh token |
| Lint | ESLint flat config + typescript-eslint | react-refresh, react-hooks |

## Estrutura de diretórios

```
src/
  app/
    App.tsx              # Entry component with providers
    Router.tsx           # Route definitions (lazy loaded)
    providers/
      AuthProvider.tsx   # Auth context
      TenantProvider.tsx # Tenant context
      QueryProvider.tsx  # TanStack Query provider
  components/
    layout/              # AppLayout, Sidebar, Topbar, PageLayout
    shared/              # LoadingSkeleton, etc.
    ui/                  # Button, etc. (via index.ts barrel exports)
  features/
    auth/                # Login, useAuth, authStore, authApi
    agenda/              # CalendarView, AgendaPage
    dashboard/           # StatCard, DashboardPage
    patients/            # PatientDetailPage, PatientsPage, patientApi
    medical-records/     # MedicalRecordsPage, medicalRecordApi
    financial/           # FinancialPage
    professionals/       # ProfessionalsPage
    reports/             # ReportsPage
    settings/            # SettingsPage
  hooks/                 # Shared hooks (useDebounce, useKeyboard, etc.)
  lib/                   # axios, queryClient, zod re-exports
  types/                 # Shared types (api, auth, patient, etc.)
  styles/                # tailwind.css, globals.css
```

## Convenções de código

### Imports
- `@/` alias para `src/` (configurado no vite.config.ts e tsconfig.json)
- `type` prefix em imports de tipos: `import type { X } from '...'`
- `verbatimModuleSyntax` ativo — usar `import type` obrigatório para tipos

### Componentes
- Functional components com arrow functions nomeadas: `export function Nome()`
- Props tipadas com interface no mesmo arquivo
- Nomes em PascalCase para componentes
- Arquivos em PascalCase.tsx (ex: `LoginForm.tsx`)
- Barrel exports via `index.ts` quando necessário

### lazy loading
- Páginas carregadas via `React.lazy()` no Router.tsx
- Envoltas em `<Suspense>` com `<PageSkeleton />` como fallback

### Estado
- **Zustand**: para estado global da aplicação (auth, tenant)
- **TanStack Query**: para estado do servidor (API calls com cache)
- **Context API**: apenas para injeção de dependência (AuthContext, TenantContext)

### API
- Instância axios centralizada em `src/lib/axios.ts`
- Interceptor de request: injecta token + tenantId
- Interceptor de response: refresh token automático em 401
- Serviços em `features/*/services/*Api.ts`

### Estilos
- Tailwind utility classes
- Design tokens via CSS variables definidas no `globals.css`
- Variáveis de cor: `bg-0..3`, `text-1..3`, `teal`, `danger`, `info`, `amber`
- Variáveis de tipografia: `--font-sans`, `--font-serif`, `--font-mono`
- Variáveis de borda: `--radius-sm/md/lg/xl`
- Animações: `animate-shimmer` para skeletons

### Formulários
- react-hook-form com zodResolver
- Schema de validação com zod definido junto ao formulário

### Hooks
- Hooks compartilhados em `src/hooks/`
- Hooks de features em `features/*/hooks/`
- Nomes: `useCamelCase`

## Comandos

```bash
npm run dev      # Dev server
npm run build    # Build production
npm run lint     # ESLint
npm run preview  # Preview build
npx tsc --noEmit # Type check

## Design System Visual

### Direção
Calmo, claro e preciso: canvas verde-acinzentado suave, cartões brancos, acento pinho (`--brand`). Tema **claro por padrão**, com escuro e "automático" (`data-theme` no `<html>`, definido antes do primeiro paint por `public/theme-init.js`; alternado por `useTheme`).
Evitar o visual "gerado por IA": sem gradientes decorativos, sem rótulos em CAIXA ALTA/mono, sem ícone dentro de tile colorido como cabeçalho de página, sem palavra em itálico no título.

### Tipografia
- Títulos e números grandes: **Bricolage Grotesque** (`font-display`, também `font-serif` por compatibilidade).
- Interface: **Figtree** (`font-sans`; `font-mono` é alias da sans — use `tabular` para números).
- Texto sempre em *sentence case*; mínimo 12px.

### Tokens (`src/styles/globals.css`)
`--bg-0` canvas, `--bg-1` cartões/popovers, `--bg-2` campos e preenchimentos, `--bg-3` hover
`--border`, `--border-hi`; `--brand`, `--brand-hi`, `--on-brand` (texto sobre o acento); `--amber`, `--danger`, `--info`
`--text-1/2/3`; sombras `--shadow-sm/md/lg`; raios `--radius-sm…xl`.
No Tailwind: `bg-bg-1`, `text-text-2`, `bg-brand/10`… (os tokens são envolvidos em `color-mix` para aceitar `/NN`).
Aliases legados: `--teal*` → `--brand*`.

### Componentes e padrões
- `PageHeader` em toda página (título + descrição + ações); `.surface` para cartões; `Button` (`primary|ghost|danger`).
- Shell: `Sidebar` com indicador deslizante, `Topbar` com busca, `CommandPalette` (Ctrl/⌘ K) e `ThemeToggle`.
- Formulários: `FormField` (o bloco inteiro é um `<label>`; não aninhar outro `<label>`).
- Datas com `formatDate` (`src/lib/date.ts`), moeda com `formatCurrency` — nunca `new Date('yyyy-MM-dd')`.

### Animações (em globals.css)
- `.page-enter` (raiz de página), `.item-enter` + `animationDelay` (stagger 35–60ms), `.rise-in`, `.animate-grow` (barras), `.lift` (hover de cartões clicáveis)
- `.animate-shimmer` (skeleton), `.animate-pop-in` (menus), `.animate-fade-in` (overlay), `.animate-scale-in` (escala simples, **sem** translate)
- Transição de rota: passe `viewTransition` em `Link`/`navigate` (CSS `::view-transition-*`).
- Contadores: `useCountUp`. Toda animação respeita `prefers-reduced-motion`.

### API
`POST /auth/login` com `{ email, password, tenantId }` → `{ accessToken, refreshToken }`
`X-Tenant-ID` header em todas as requisições (injetado pelo interceptor axios)

### Dados de Login (dev)
| Clínica | Admin | Password | tenantId |
|---------|-------|----------|----------|
| Clínica Serenity | admin@serenity.com.br | Psyke2024! | ef33e873-2210-4fde-8785-7c6700ce7a13 |
| Espaço Acolher | admin@acolher.com.br | Psyke2024! | a03f7999-22e0-45b5-af4e-a4c44090389d |
| Núcleo Equilíbrio | admin@equilibrio.com.br | Psyke2024! | 3e885a65-d6ea-49ac-9adc-61e26b6cd647 |
```
