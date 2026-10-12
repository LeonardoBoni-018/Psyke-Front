#!/usr/bin/env node
/**
 * Adds a realistic amount of activity to an existing demo clinic (run seed-demo.mjs first):
 * more patients, ~10 weeks of history plus 3 weeks of upcoming agenda, invoices with mixed payment
 * methods/statuses, medical records with anamnesis and clinical evolutions, and a waiting list.
 *
 *   API_URL=https://psyke-api.onrender.com DEMO_PASSWORD=... node scripts/seed-extra.mjs
 *
 * Idempotent enough: it stops early if the clinic already has 25+ patients, and every create tolerates 409s.
 */

const API = (process.env.API_URL ?? 'http://localhost:8080').replace(/\/$/, '')
const SLUG = process.env.DEMO_SLUG ?? 'clinica-demo'
const EMAIL = process.env.DEMO_EMAIL ?? 'admin@psyke.demo'
const PASSWORD = process.env.DEMO_PASSWORD ?? 'Psyke@Demo2026'
const CONCURRENCY = Number(process.env.SEED_CONCURRENCY ?? 4)

let token = ''

async function call(method, path, body, { allow = [] } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok && !allow.includes(res.status)) throw new Error(`${method} ${path} → ${res.status} ${data?.message ?? text}`)
  return { status: res.status, data }
}

/** Runs async tasks with a small concurrency limit (the free API tier is slow but handles a few at once). */
async function pool(items, worker, limit = CONCURRENCY) {
  const results = new Array(items.length)
  let next = 0
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++
      results[i] = await worker(items[i], i)
    }
  }))
  return results
}

const pad = (n) => String(n).padStart(2, '0')
const localDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const at = (d, h, m) => `${localDate(d)}T${pad(h)}:${pad(m)}:00`
const addDays = (d, n) => { const c = new Date(d); c.setDate(c.getDate() + n); return c }
const asList = (d) => (Array.isArray(d) ? d : d?.content ?? [])
// Deterministic integer hash (FNV-1a + avalanche) so reruns produce the same shape of data.
function h(...parts) {
  let x = 2166136261
  for (const v of parts) {
    x ^= (v + 0x9e3779b9) | 0
    x = Math.imul(x, 16777619)
  }
  x ^= x >>> 15
  x = Math.imul(x, 2246822519)
  x ^= x >>> 13
  return x >>> 0
}

const NEW_PATIENTS = [
  ['Ana Clara Menezes', '1995-05-14', 'Feminino', 'Solteiro(a)', 'Analista de marketing', 'Unimed'],
  ['Rodrigo Tavares Lopes', '1982-09-02', 'Masculino', 'Casado(a)', 'Médico', null],
  ['Juliana Prado Siqueira', '1990-12-19', 'Feminino', 'Casado(a)', 'Advogada', 'Bradesco Saúde'],
  ['Marcos Vinícius Azevedo', '2000-03-27', 'Masculino', 'Solteiro(a)', 'Desenvolvedor', null],
  ['Patrícia Gomes Duarte', '1976-07-08', 'Feminino', 'Divorciado(a)', 'Professora universitária', 'SulAmérica'],
  ['Henrique Salgado Neto', '1988-11-30', 'Masculino', 'Casado(a)', 'Engenheiro civil', null],
  ['Fernanda Lacerda Vieira', '1993-02-11', 'Feminino', 'Solteiro(a)', 'Enfermeira', 'Amil'],
  ['Caio Ribeiro Machado', '2004-08-21', 'Masculino', 'Solteiro(a)', 'Estudante de direito', null],
  ['Luciana Barros Pinheiro', '1971-01-25', 'Feminino', 'Viúvo(a)', 'Contadora', 'Unimed'],
  ['Eduardo Matos Figueiredo', '1985-06-16', 'Masculino', 'Casado(a)', 'Gerente comercial', null],
  ['Renata Cavalcanti Moura', '1999-10-05', 'Feminino', 'Solteiro(a)', 'Designer de produto', 'Bradesco Saúde'],
  ['Gabriel Fontes Albuquerque', '2008-04-09', 'Masculino', 'Solteiro(a)', 'Estudante', 'Amil'],
  ['Simone Aparecida Rocha', '1969-12-01', 'Feminino', 'Casado(a)', 'Servidora pública', null],
  ['Leandro Pacheco Brandão', '1992-03-18', 'Masculino', 'União estável', 'Fotógrafo', null],
  ['Vanessa Teixeira Campos', '1987-09-23', 'Feminino', 'Casado(a)', 'Farmacêutica', 'SulAmérica'],
  ['Otávio Bernardes Lins', '1979-05-30', 'Masculino', 'Divorciado(a)', 'Arquiteto', null],
  ['Bruna Esteves Carvalho', '2002-07-12', 'Feminino', 'Solteiro(a)', 'Estagiária de psicologia', null],
  ['Thales Magalhães Prado', '1984-02-28', 'Masculino', 'Casado(a)', 'Empreendedor', 'Unimed'],
  ['Mônica Veloso Andrade', '1966-10-17', 'Feminino', 'Casado(a)', 'Aposentada', null],
  ['Diego Fernandes Cunha', '1996-01-06', 'Masculino', 'Solteiro(a)', 'Analista de dados', 'Amil'],
  ['Larissa Monteiro Vaz', '2009-11-14', 'Feminino', 'Solteiro(a)', 'Estudante', 'Bradesco Saúde'],
  ['Sérgio Antunes Bastos', '1974-08-03', 'Masculino', 'Casado(a)', 'Motorista de aplicativo', null],
]

const COMPLAINTS = [
  ['Ansiedade generalizada com preocupação constante e tensão muscular.', 'Início gradual há cerca de um ano, agravado por sobrecarga no trabalho.'],
  ['Humor deprimido, desânimo e perda de interesse em atividades habituais.', 'Piora nos últimos 4 meses após término de relacionamento.'],
  ['Dificuldade de relacionamento e conflitos recorrentes com a família.', 'Padrão presente desde a adolescência, com intensificação recente.'],
  ['Crises de pânico esporádicas, com medo de sair de casa sozinho(a).', 'Primeira crise há 6 meses, em transporte público.'],
  ['Luto pela perda de familiar próximo e dificuldade de retomar a rotina.', 'Perda ocorrida há 3 meses; sono e apetite alterados.'],
  ['Estresse ocupacional e sinais de esgotamento profissional.', 'Jornadas extensas há mais de dois anos, sem pausas regulares.'],
  ['Baixa autoestima e autocrítica excessiva em contextos sociais.', 'Relata padrão desde a infância, com momentos de maior sofrimento na faculdade.'],
  ['Dificuldade de concentração e procrastinação que afetam os estudos.', 'Queixa antiga, agravada no último semestre.'],
]

const SOAP = [
  { s: 'Relata semana tranquila, com duas noites de sono ruim. Sentiu ansiedade antes de uma reunião importante.', o: 'Postura mais relaxada que na sessão anterior. Discurso organizado, humor eutímico.', a: 'Redução de sintomas ansiosos; mantém boa adesão às tarefas de casa.', p: 'Seguir com registro de pensamentos e treino de respiração. Revisar exposição gradual.', t: 'Reestruturação cognitiva; respiração diafragmática' },
  { s: 'Traz conflito com familiar no fim de semana e sente culpa por ter reagido com irritação.', o: 'Choro contido ao relatar o episódio; boa capacidade de insight ao final da sessão.', a: 'Dificuldade de assertividade em relações próximas; sinais de melhora na regulação emocional.', p: 'Trabalhar comunicação assertiva; role-play na próxima sessão.', t: 'Treino de assertividade; psicoeducação' },
  { s: 'Refere melhora do humor e retomada de atividades prazerosas (caminhada e encontro com amigos).', o: 'Afeto mais expansivo, contato visual preservado.', a: 'Evolução favorável no quadro depressivo; manter acompanhamento.', p: 'Ativação comportamental com metas semanais; reavaliar em 15 dias.', t: 'Ativação comportamental' },
  { s: 'Relata nova crise de ansiedade no trânsito, controlada com as técnicas aprendidas.', o: 'Fala um pouco acelerada no início, normalizando ao longo da sessão.', a: 'Uso eficaz de estratégias de enfrentamento; redução da evitação.', p: 'Hierarquia de exposição: próximo passo é trajeto curto de ônibus.', t: 'Exposição gradual; mindfulness' },
  { s: 'Sessão dedicada à elaboração do luto; lembra memórias afetivas com tristeza e gratidão.', o: 'Emoção congruente ao conteúdo, sem ideação de risco.', a: 'Processo de luto em curso, dentro do esperado.', p: 'Escrita de carta de despedida como tarefa; manter frequência semanal.', t: 'Escuta ativa; técnica da carta' },
]

async function main() {
  console.log(`Adding activity to ${API} (clinic "${SLUG}")`)
  const login = await call('POST', '/auth/login', { email: EMAIL, password: PASSWORD, tenantId: SLUG })
  token = login.data.accessToken

  const existing = await call('GET', '/patients?size=1')
  if (existing.data.totalElements >= 25 && !process.env.FORCE) {
    console.log(`• ${existing.data.totalElements} patients already — nothing to add (set FORCE=1 to run anyway).`)
    return
  }

  const professionals = asList((await call('GET', '/professionals?size=100')).data)
  const rooms = asList((await call('GET', '/rooms?size=100')).data)
  if (professionals.length === 0 || rooms.length === 0) throw new Error('Run seed-demo.mjs first (no professionals/rooms).')

  // ---- patients ----
  const created = await pool(NEW_PATIENTS, async ([fullName, birthDate, gender, maritalStatus, occupation, insurance], i) => {
    const first = fullName.split(' ')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    const res = await call('POST', '/patients', {
      fullName, birthDate, gender, maritalStatus, occupation,
      insurance: insurance ?? undefined,
      insuranceNumber: insurance ? `${200000 + i * 6173}` : undefined,
      cpf: String(30000000000 + i * 7654321).slice(0, 11),
      phone: `(11) 9${7000 + i}-${2000 + i * 53}`,
      email: `${first}.${i + 20}@email.com`,
      referredBy: i % 4 === 0 ? 'Indicação de paciente' : i % 7 === 0 ? 'Encaminhamento médico' : undefined,
    }, { allow: [409, 400] })
    return res.status < 400 ? res.data : null
  })
  const allPatients = asList((await call('GET', '/patients?size=100')).data)
  console.log(`✓ patients: ${created.filter(Boolean).length} new (${allPatients.length} total)`)

  // ---- appointments ----
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const jobs = []
  for (let offset = -70; offset <= 21; offset++) {
    const day = addDays(today, offset)
    if (day.getDay() === 0 || day.getDay() === 6) continue
    professionals.forEach((prof, pi) => {
      const used = new Set()
      for (let n = 0; n < 4; n++) {
        const morning = (h(offset, pi, n) % 5) < 2
        const k = h(offset, pi, n, 3) % (morning ? 4 : 6)
        const key = `${morning}-${k}`
        if (used.has(key)) continue
        used.add(key)
        const minutes = (morning ? 8 : 13) * 60 + k * prof.sessionDuration
        const patient = allPatients[h(offset, pi, n, 9) % allPatients.length]
        jobs.push({ offset, prof, pi, n, patient, h: Math.floor(minutes / 60), m: minutes % 60 })
      }
    })
  }

  const made = (await pool(jobs, async (j) => {
    const start = at(addDays(today, j.offset), j.h, j.m)
    const endDate = new Date(start)
    endDate.setMinutes(endDate.getMinutes() + j.prof.sessionDuration)
    const res = await call('POST', '/appointments', {
      patientId: j.patient.id, professionalId: j.prof.id, roomId: rooms[(j.pi + j.n) % rooms.length].id,
      startTime: start, endTime: at(endDate, endDate.getHours(), endDate.getMinutes()),
      notes: j.n === 0 && j.offset % 7 === 0 ? 'Retorno' : undefined,
    }, { allow: [409, 404, 400] })
    return res.status < 400 ? { ...res.data, ...j } : null
  })).filter(Boolean)
  console.log(`✓ appointments: ${made.length} created`)

  // ---- status, sessions and invoices ----
  const methods = ['pix', 'credit_card', 'debit_card', 'cash', 'insurance']
  const doneByPatient = new Map()
  let doneCount = 0
  await pool(made, async (a, i) => {
    const setStatus = (status, reason) => call('PATCH', `/appointments/${a.id}/status`, { status, reason }, { allow: [422, 400] })
    const r = h(i, a.offset)
    if (a.offset < 0 || (a.offset === 0 && a.h < 12)) {
      if (r % 11 === 0) return setStatus('CANCELLED', ['Paciente remarcou', 'Imprevisto de saúde', 'Conflito de agenda'][r % 3])
      if (r % 17 === 0) return setStatus('NO_SHOW')
      await setStatus('CONFIRMED')
      const sess = await call('POST', `/appointments/${a.id}/session`, { prontuario: 'Sessão realizada conforme plano terapêutico.' }, { allow: [422, 400, 409] })
      if (sess.status >= 400) return
      doneCount++
      doneByPatient.set(a.patient.id, [...(doneByPatient.get(a.patient.id) ?? []), a])
      const paid = r % 5 !== 0 && a.offset < -3
      const inv = await call('POST', '/invoices', {
        appointmentId: a.id, patientId: a.patient.id, professionalId: a.prof.id,
        amount: a.prof.sessionValue,
        paymentMethod: paid ? methods[r % methods.length] : undefined,
        notes: r % 6 === 0 ? 'Sessão de acompanhamento' : 'Sessão de psicoterapia',
      }, { allow: [400, 409] })
      if (paid && inv.status < 400) {
        await call('PUT', `/invoices/${inv.data.id}`, { status: 'PAID', paymentDate: `${at(addDays(today, a.offset), 12 + (r % 6), 0)}-03:00` }, { allow: [400] })
      }
    } else if (r % 3 !== 0) {
      await setStatus('CONFIRMED')
    }
  })
  console.log(`✓ sessions completed with invoices: ${doneCount}`)

  // ---- medical records, anamnesis and evolutions ----
  let records = 0
  let evolutions = 0
  await pool(allPatients.slice(0, 20), async (patient, i) => {
    let pr = await call('POST', '/prontuarios', {
      patientId: patient.id,
      allergies: i % 5 === 0 ? 'Dipirona' : 'Nenhuma conhecida',
      chronicConditions: i % 6 === 0 ? 'Hipotireoidismo em tratamento' : i % 9 === 0 ? 'Hipertensão controlada' : '',
      medications: i % 4 === 0 ? 'Escitalopram 10 mg' : '',
      notes: 'Acompanhamento psicoterápico semanal.',
    }, { allow: [400, 409] })
    if (pr.status >= 400) pr = await call('GET', `/prontuarios/patient/${patient.id}`, null, { allow: [404, 400] })
    if (pr.status >= 400 || !pr.data?.id) return
    records++
    const [chief, history] = COMPLAINTS[i % COMPLAINTS.length]
    await call('POST', `/prontuarios/${pr.data.id}/anamnese`, {
      prontuarioId: pr.data.id,
      chiefComplaint: chief,
      historyIllness: history,
      personalHistory: 'Sem internações psiquiátricas. Desenvolvimento dentro do esperado.',
      familyHistory: i % 3 === 0 ? 'Histórico familiar de ansiedade.' : 'Sem antecedentes relevantes.',
      socialHistory: 'Rede de apoio presente; rotina de trabalho/estudo estável.',
      medications: i % 4 === 0 ? 'Escitalopram 10 mg' : 'Nenhuma no momento.',
    }, { allow: [400, 409] })

    const sessions = (doneByPatient.get(patient.id) ?? []).sort((a, b) => a.startTime.localeCompare(b.startTime)).slice(0, 4)
    for (const [k, a] of sessions.entries()) {
      const t = SOAP[(i + k) % SOAP.length]
      const ev = await call('POST', `/prontuarios/${pr.data.id}/evolucoes`, {
        appointmentId: a.id, subjective: t.s, objective: t.o, assessment: t.a, plan: t.p, techniques: t.t,
      }, { allow: [400, 409, 422] })
      if (ev.status < 400) evolutions++
    }
  })
  console.log(`✓ medical records: ${records}, clinical evolutions: ${evolutions}`)

  // ---- waiting list ----
  let waiting = 0
  for (const [i, patient] of allPatients.slice(-4).entries()) {
    const res = await call('POST', '/waiting-list', {
      patientId: patient.id, professionalId: professionals[i % professionals.length].id, priority: (i % 3) + 1,
    }, { allow: [400, 409, 404] })
    if (res.status < 400) waiting++
  }
  console.log(`✓ waiting list entries: ${waiting}`)

  const finalCount = await call('GET', '/patients?size=1')
  console.log(`\nPronto. ${finalCount.data.totalElements} pacientes na clínica "${SLUG}".`)
}

main().catch((err) => {
  console.error('✗', err.message)
  process.exit(1)
})
