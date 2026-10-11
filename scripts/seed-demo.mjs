#!/usr/bin/env node
/**
 * Creates a demo clinic with realistic data through the public API.
 *
 *   node scripts/seed-demo.mjs                       # API at http://localhost:8080
 *   API_URL=https://psyke-api.onrender.com node scripts/seed-demo.mjs
 *
 * Optional env: DEMO_SLUG (default "clinica-demo"), DEMO_EMAIL, DEMO_PASSWORD.
 * Idempotent per slug: if the clinic already exists it only logs in and adds missing data.
 */

const API = (process.env.API_URL ?? 'http://localhost:8080').replace(/\/$/, '')
const SLUG = process.env.DEMO_SLUG ?? 'clinica-demo'
const EMAIL = process.env.DEMO_EMAIL ?? 'admin@psyke.demo'
const PASSWORD = process.env.DEMO_PASSWORD ?? 'Psyke@Demo2026'

let token = ''

async function call(method, path, body, { allow = [] } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok && !allow.includes(res.status)) {
    throw new Error(`${method} ${path} → ${res.status} ${data?.message ?? text}`)
  }
  return { status: res.status, data }
}

const asList = (d) => (Array.isArray(d) ? d : d?.content ?? [])
const pad = (n) => String(n).padStart(2, '0')
const localDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const at = (d, h, m) => `${localDate(d)}T${pad(h)}:${pad(m)}:00`
const addDays = (d, n) => {
  const c = new Date(d)
  c.setDate(c.getDate() + n)
  return c
}

async function main() {
  console.log(`Seeding ${API} (clinic "${SLUG}")`)

  const created = await call('POST', '/tenants', {
    name: 'Clínica Demo Psyke',
    slug: SLUG,
    plan: 'PRO',
    adminEmail: EMAIL,
    adminPassword: PASSWORD,
    adminName: 'Helena Duarte',
  }, { allow: [409] })
  console.log(created.status === 409 ? '• Clinic already exists, logging in' : '✓ Clinic created')

  const login = await call('POST', '/auth/login', { email: EMAIL, password: PASSWORD, tenantId: SLUG })
  token = login.data.accessToken

  const existingPatients = await call('GET', '/patients?size=1')
  if (existingPatients.data.totalElements > 0) {
    console.log('• Demo data already present. Nothing to do.')
    return printCredentials()
  }

  const clinic = (await call('GET', '/clinics/current')).data
  await call('PUT', `/clinics/${clinic.id}`, {
    name: 'Clínica Demo Psyke',
    legalName: 'Psyke Serviços Psicológicos Ltda',
    crp: '06/00000',
    phone: '(11) 3333-4444',
    address: 'Rua Augusta, 1500 – Consolação, São Paulo – SP',
  }, { allow: [403, 404, 405] })

  const rooms = []
  for (const r of [
    { name: 'Sala Ipê', color: '#0ec4a0', capacity: 2, type: 'PHYSICAL' },
    { name: 'Sala Jacarandá', color: '#4a9eff', capacity: 4, type: 'PHYSICAL' },
    { name: 'Teleatendimento', color: '#f5a623', capacity: 1, type: 'VIRTUAL' },
  ]) {
    const res = await call('POST', '/rooms', r, { allow: [409] })
    rooms.push(res.status === 409 ? (asList((await call('GET', '/rooms?size=100')).data).find((x) => x.name === r.name) ?? r) : res.data)
  }
  console.log(`✓ ${rooms.length} rooms`)

  const professionals = []
  for (const p of [
    { crp: '06/112233', fullName: 'Dra. Ana Beatriz Moreira', specialty: 'Psicologia clínica', approach: 'Terapia cognitivo-comportamental', sessionValue: 220, sessionDuration: 50, acceptsInsurance: true, resume: 'Especialista em ansiedade e depressão em adultos.' },
    { crp: '06/445566', fullName: 'Dr. Rafael Teixeira', specialty: 'Psicologia infantil', approach: 'Ludoterapia', sessionValue: 200, sessionDuration: 45, acceptsInsurance: false, resume: 'Atendimento de crianças e orientação de pais.' },
    { crp: '06/778899', fullName: 'Dra. Juliana Prado', specialty: 'Neuropsicologia', approach: 'Psicanálise', sessionValue: 260, sessionDuration: 50, acceptsInsurance: true, resume: 'Avaliação neuropsicológica e psicoterapia psicanalítica.' },
  ]) {
    const res = await call('POST', '/professionals', p, { allow: [409] })
    professionals.push(res.status === 409 ? asList((await call('GET', '/professionals?size=100')).data).find((x) => x.crp === p.crp) : res.data)
  }
  console.log(`✓ ${professionals.length} professionals`)

  for (const prof of professionals) {
    for (const day of [1, 2, 3, 4, 5]) {
      await call('POST', `/professionals/${prof.id}/availability`, { dayOfWeek: day, startTime: '08:00', endTime: '12:00', sessionDuration: prof.sessionDuration }, { allow: [409] })
      await call('POST', `/professionals/${prof.id}/availability`, { dayOfWeek: day, startTime: '13:00', endTime: '19:00', sessionDuration: prof.sessionDuration }, { allow: [409] })
    }
  }
  console.log('✓ Weekly availability (Mon–Fri, 08–12 and 13–19)')

  const patientSeed = [
    ['Mariana Costa Ribeiro', '1991-03-12', 'Feminino', 'Solteiro(a)', 'Designer', 'Unimed'],
    ['Lucas Andrade Pereira', '1986-07-22', 'Masculino', 'Casado(a)', 'Engenheiro de software', null],
    ['Beatriz Nogueira Lima', '1998-11-08', 'Feminino', 'Solteiro(a)', 'Estudante de medicina', 'SulAmérica'],
    ['Pedro Henrique Alves', '1979-04-30', 'Masculino', 'Divorciado(a)', 'Advogado', null],
    ['Camila Ferreira Rocha', '2001-09-15', 'Feminino', 'Solteiro(a)', 'Universitária', 'Bradesco Saúde'],
    ['Gustavo Martins Souza', '1988-01-20', 'Masculino', 'Casado(a)', 'Empresário', null],
    ['Larissa Monteiro Dias', '1994-06-03', 'Feminino', 'Casado(a)', 'Professora', 'Unimed'],
    ['Thiago Barbosa Cardoso', '1983-12-11', 'Masculino', 'Solteiro(a)', 'Jornalista', null],
    ['Isabela Ramos Freitas', '2010-02-27', 'Feminino', 'Solteiro(a)', 'Estudante', 'Amil'],
    ['Felipe Carvalho Mendes', '1975-08-19', 'Masculino', 'Viúvo(a)', 'Arquiteto', null],
  ]
  const patients = []
  for (const [i, [fullName, birthDate, gender, maritalStatus, occupation, insurance]] of patientSeed.entries()) {
    const first = fullName.split(' ')[0].toLowerCase()
    patients.push((await call('POST', '/patients', {
      fullName, birthDate, gender, maritalStatus, occupation,
      insurance: insurance ?? undefined,
      insuranceNumber: insurance ? `${100000 + i * 7919}` : undefined,
      cpf: `${String(11122233300 + i * 1111111).slice(0, 11)}`,
      phone: `(11) 9${8000 + i}-${1000 + i * 37}`,
      email: `${first}.demo${i}@email.com`,
      referredBy: i % 3 === 0 ? 'Indicação de amigo' : undefined,
    })).data)
  }
  console.log(`✓ ${patients.length} patients`)

  // Appointments: past 4 weeks (done / no-show / cancelled) and next 2 weeks (scheduled / confirmed)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const appointments = []
  let made = 0
  for (let offset = -28; offset <= 14; offset++) {
    const day = addDays(today, offset)
    const dow = day.getDay()
    if (dow === 0 || dow === 6) continue
    for (const [pi, prof] of professionals.entries()) {
      // Slot boundaries follow the availability windows: 08:00 + k·duration and 13:00 + k·duration
      const slot = (windowStartHour, k) => {
        const minutes = windowStartHour * 60 + k * prof.sessionDuration
        return [Math.floor(minutes / 60), minutes % 60]
      }
      const picks = offset === 0
        ? [slot(8, 1), slot(13, 1), slot(13, 3)]
        : [slot(8, (offset + pi + 30) % 3), slot(13, (pi + offset + 30) % 4)]
      for (const [hi, [h, m]] of picks.entries()) {
        const patient = patients[(Math.abs(offset) + pi * 3 + hi) % patients.length]
        const start = at(day, h, m)
        const endDate = new Date(`${start}`)
        endDate.setMinutes(endDate.getMinutes() + prof.sessionDuration)
        const end = at(endDate, endDate.getHours(), endDate.getMinutes())
        const res = await call('POST', '/appointments', {
          patientId: patient.id, professionalId: prof.id, roomId: rooms[(pi + hi) % rooms.length].id,
          startTime: start, endTime: end, notes: hi === 0 && offset % 5 === 0 ? 'Primeira consulta' : undefined,
        }, { allow: [409, 404] })
        if (res.status >= 400) continue
        made++
        appointments.push({ ...res.data, offset, prof, patient })
      }
    }
  }
  console.log(`✓ ${made} appointments`)

  let done = 0
  for (const [i, a] of appointments.entries()) {
    const setStatus = (status, reason) => call('PATCH', `/appointments/${a.id}/status`, { status, reason }, { allow: [422] })
    if (a.offset < 0) {
      if (i % 11 === 0) { await setStatus('CANCELLED', 'Paciente remarcou'); continue }
      if (i % 13 === 0) { await setStatus('NO_SHOW'); continue }
      await setStatus('CONFIRMED')
      await call('POST', `/appointments/${a.id}/session`, { prontuario: 'Sessão realizada conforme plano terapêutico.' })
      done++
      const paid = i % 4 !== 0
      await call('POST', '/invoices', {
        appointmentId: a.id, patientId: a.patient.id, professionalId: a.prof.id,
        amount: a.prof.sessionValue, paymentMethod: paid ? (i % 2 ? 'PIX' : 'Cartão de crédito') : undefined,
        paymentDate: paid ? `${at(addDays(today, a.offset), 18, 0)}-03:00` : undefined,
        notes: 'Sessão de psicoterapia',
      }).then(async (inv) => {
        if (paid) await call('PUT', `/invoices/${inv.data.id}`, { status: 'PAID' })
      })
    } else if (a.offset >= 0 && i % 2 === 0) {
      await setStatus('CONFIRMED')
    }
  }
  console.log(`✓ ${done} completed sessions with invoices`)

  // Medical records for the first patients
  for (const patient of patients.slice(0, 5)) {
    const pr = await call('POST', '/prontuarios', {
      patientId: patient.id,
      allergies: 'Nenhuma conhecida',
      chronicConditions: patient.fullName.startsWith('Pedro') ? 'Hipertensão controlada' : '',
      medications: patient.fullName.startsWith('Lucas') ? 'Sertralina 50 mg' : '',
      notes: 'Paciente encaminhado para psicoterapia individual semanal.',
    }, { allow: [400, 409] })
    if (pr.status >= 400) continue
    await call('POST', `/prontuarios/${pr.data.id}/anamnese`, {
      prontuarioId: pr.data.id,
      chiefComplaint: 'Ansiedade intensa em situações de trabalho e dificuldade para dormir.',
      historyIllness: 'Sintomas iniciados há cerca de 8 meses, após mudança de emprego.',
      personalHistory: 'Sem internações prévias. Pratica atividade física 2x por semana.',
      familyHistory: 'Mãe com histórico de depressão.',
      socialHistory: 'Mora com o(a) parceiro(a). Boa rede de apoio.',
      medications: 'Nenhuma no momento.',
    }, { allow: [400, 409] })
  }
  console.log('✓ Medical records and anamneses')

  printCredentials()
}

function printCredentials() {
  console.log('\nDemo pronto. Acesse com:')
  console.log(`  Clínica: ${SLUG}`)
  console.log(`  E-mail:  ${EMAIL}`)
  console.log(`  Senha:   ${PASSWORD}`)
}

main().catch((err) => {
  console.error('✗', err.message)
  process.exit(1)
})
