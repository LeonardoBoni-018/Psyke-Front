# Deploy do Psyke (Vercel + API + PostgreSQL)

Nenhuma parte da aplicação depende de `localhost` em produção.

```
Navegador ──► Vercel (front estático, React/Vite)
                 │  HTTPS + CORS (VITE_API_URL)
                 ▼
              API Spring Boot (container Docker: Render / Fly / Railway)
                 │  JDBC (conexão DIRETA)
                 ▼
              PostgreSQL gerenciado (Neon / Render Postgres / Supabase)
```

> **Por que a API não vai para a Vercel?** A Vercel hospeda sites estáticos e funções serverless
> de curta duração. A API é uma aplicação Java (Spring Boot) que mantém pool de conexões e jobs
> agendados, então precisa de um host que rode containers. O repositório da API já traz o
> `Dockerfile` de produção e o `render.yaml`.

## Ordem recomendada

### 1. Banco de dados (PostgreSQL)

1. Crie um banco no [Neon](https://neon.tech) (ou Render Postgres).
2. Copie a connection string **direta** (host *sem* `-pooler`). O isolamento por clínica usa
   `search_path` na sessão, que PgBouncer/pooler não preserva.
3. Formato aceito pela API: `postgres://usuario:senha@host/db?sslmode=require` (ou `jdbc:postgresql://…`).

### 2. API (Render, via Blueprint)

1. Suba o repositório da API (`psyke`) para o GitHub.
2. Render → **New → Blueprint** → selecione o repositório (usa o `render.yaml`).
3. Preencha as variáveis marcadas como `sync: false`:

| Variável | Valor |
|---|---|
| `PSYKE_DB_URL` | connection string direta do passo 1 |
| `PSYKE_CORS_ORIGINS` | `https://SEU-PROJETO.vercel.app,https://SEU-PROJETO-*.vercel.app` (o 2º cobre os previews) |
| `PSYKE_FRONTEND_URL` | `https://SEU-PROJETO.vercel.app` (links dos e-mails de redefinição de senha) |

`PSYKE_JWT_SECRET` é gerado pelo Render. Em `prod` a API **recusa** secret fraco e desliga o Swagger.

4. Aguarde o deploy e teste: `https://SUA-API.onrender.com/actuator/health` → `{"status":"UP"}`.

> **Plano gratuito do Render:** a instância dorme após ~15 min sem uso e o primeiro request leva
> 30–60 s. O front já espera até 60 s e avisa "Conectando…" no login. Para uso real, use um plano
> pago (sem sleep).

### 3. Front (Vercel)

1. Vercel → **Add New → Project** → importe o repositório do front (`psyke-web`).
   Framework **Vite** é detectado; `vercel.json` já define build, SPA fallback, cache e headers de segurança.
2. Em **Settings → Environment Variables** (Production **e** Preview):

| Variável | Valor |
|---|---|
| `VITE_API_URL` | `https://SUA-API.onrender.com` (sem barra no final) |

3. **Deploy.** O build falha de propósito se `VITE_API_URL` estiver ausente, não for `https` ou
   apontar para `localhost`, para que um bundle quebrado nunca vá ao ar.
4. Copie a URL final da Vercel e confirme que ela está coberta por `PSYKE_CORS_ORIGINS` na API.
   Se o domínio mudou, atualize a variável no Render (ele reinicia sozinho).

### 4. Primeira clínica

A criação de clínica é pública (`POST /tenants`). Para uma clínica de demonstração com dados:

```bash
API_URL=https://SUA-API.onrender.com node scripts/seed-demo.mjs
```

Login: clínica `clinica-demo`, e-mail `admin@psyke.demo` (a senha está no topo do script; **troque em produção**
com `DEMO_PASSWORD=...`).

## Checklist pós-deploy

- [ ] `GET /actuator/health` da API retorna `UP`
- [ ] Login funciona no site da Vercel (sem erro de CORS no console)
- [ ] Recarregar uma rota profunda (`/patients`) abre o app (SPA fallback)
- [ ] `https://SUA-API/swagger-ui.html` **não** está acessível
- [ ] Senha errada mostra a mensagem de erro no login

## Desenvolvimento local

```bash
# API (na pasta psyke)
docker compose up -d postgres-db
./mvnw spring-boot:run

# Front (nesta pasta) — crie .env.local com VITE_API_URL=http://localhost:8080
npm install
npm run dev
```

Abra o front por `http://localhost:5173` (não `127.0.0.1`): o CORS da API libera `localhost`.

## Qualidade

```bash
npm run lint && npm test && npm run build
```

## Pontos de atenção conhecidos

- **Rate limit de login:** há dois limites. Por IP (`X-Forwarded-For`, pode ser contornado se o proxy acrescentar
  ao cabeçalho) e **por conta** (clínica + e-mail): 10 falhas em 15 min bloqueiam novas tentativas daquela conta,
  mesmo trocando de IP. Ajustável por `PSYKE_RATE_LIMIT_*` / `psyke.rate-limit.account-*`. Contrapartida: alguém
  pode bloquear temporariamente uma conta conhecida errando de propósito; o bloqueio expira sozinho. Estado em memória
  (uma instância); com várias réplicas, mova para Redis.
- **Tokens no `localStorage`:** padrão para SPAs, mas expostos a XSS. O CSP em `vercel.json` reduz o risco;
  evite adicionar scripts de terceiros sem revisar o `script-src`.
- **CSP:** `connect-src` permite qualquer `https:` porque a URL da API varia por ambiente. Para endurecer,
  troque por `'self' https://SUA-API.onrender.com`.
