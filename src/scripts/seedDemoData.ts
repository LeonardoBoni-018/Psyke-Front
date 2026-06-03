import { api } from '@/lib/axios'

export async function seedDemoData() {
  console.log('[Seed] Iniciando população de dados demo...')

  try {
    try {
      await api.put('/clinics/current', {
        name: 'Centro de Psicologia Bem-Estar',
        legalName: 'Bem-Estar Serviços Psicológicos Ltda',
        crp: '06/12345',
        phone: '+5511988887777',
        address: 'Av. Paulista, 1000 - São Paulo, SP',
      })
      console.log('[Seed] ✓ Clínica atualizada')
    } catch { console.warn('[Seed] Clínica skip') }

    const rooms: Record<string, string> = {}
    const roomData = [
      { name: 'Sala 01', color: '#0ec4a0', capacity: 2, type: 'PHYSICAL' },
      { name: 'Sala 02', color: '#4a9eff', capacity: 2, type: 'PHYSICAL' },
      { name: 'Teleconsulta', color: '#f5a623', capacity: 1, type: 'VIRTUAL' },
    ]
    for (const r of roomData) {
      try {
        const res = await api.post('/rooms', r)
        rooms[r.name] = res.data.id
        console.log(`[Seed] ✓ Sala criada: ${r.name}`)
      } catch { console.warn(`[Seed] Sala ${r.name} skip`) }
    }

    const profs: Record<string, string> = {}
    const profData = [
      { crp: '06/12345', fullName: 'Dra. Ana Beatriz Silva', specialty: 'Psicologia Clínica', approach: 'TCC', sessionDuration: 50, acceptsInsurance: true },
      { crp: '06/98765', fullName: 'Dr. Carlos Eduardo Lima', specialty: 'Neuropsicologia', approach: 'Psicanálise', sessionDuration: 50, acceptsInsurance: false },
    ]
    for (const p of profData) {
      try {
        const res = await api.post('/professionals', p)
        profs[p.crp] = res.data.id
        console.log(`[Seed] ✓ Profissional criado: ${p.fullName}`)
      } catch { console.warn(`[Seed] Prof ${p.fullName} skip`) }
    }

    const profId = Object.values(profs)[0]
    if (profId) {
      for (const day of [1, 2, 3, 4, 5]) {
        try {
          await api.post(`/professionals/${profId}/availability`, {
            dayOfWeek: day,
            startTime: '08:00',
            endTime: '18:00',
            sessionDuration: 50,
          })
        } catch { /* ignore */ }
      }
      console.log('[Seed] ✓ Disponibilidade configurada')
    }

    const patients: Record<string, string> = {}
    const patientData = [
      { fullName: 'Marina Oliveira Santos', birthDate: '1990-03-12', cpf: '111.222.333-44', gender: 'FEMALE', maritalStatus: 'SINGLE', occupation: 'Designer', phone: '+5511988881111', email: 'marina.oliveira@email.com' },
      { fullName: 'Rafael Mendes Costa', birthDate: '1985-07-22', cpf: '222.333.444-55', gender: 'MALE', maritalStatus: 'MARRIED', occupation: 'Analista de TI', phone: '+5511988882222', email: 'rafael.mendes@email.com' },
      { fullName: 'Carla Beatriz Santos', birthDate: '1995-11-08', cpf: '333.444.555-66', gender: 'FEMALE', maritalStatus: 'SINGLE', occupation: 'Estudante', phone: '+5511988883333', email: 'carla.santos@email.com' },
      { fullName: 'João Paulo Ferreira', birthDate: '1978-04-30', cpf: '444.555.666-77', gender: 'MALE', maritalStatus: 'DIVORCED', occupation: 'Advogado', phone: '+5511988884444', email: 'joao.ferreira@email.com' },
      { fullName: 'Luísa Fernanda Lima', birthDate: '2000-09-15', cpf: '555.666.777-88', gender: 'FEMALE', maritalStatus: 'SINGLE', occupation: 'Universitária', phone: '+5511988885555', email: 'luisa.lima@email.com' },
      { fullName: 'André Gustavo Pereira', birthDate: '1988-01-20', cpf: '666.777.888-99', gender: 'MALE', maritalStatus: 'MARRIED', occupation: 'Empresário', phone: '+5511988886666', email: 'andre.pereira@email.com' },
    ]
    for (const p of patientData) {
      try {
        const res = await api.post('/patients', p)
        patients[p.fullName] = res.data.id
        console.log(`[Seed] ✓ Paciente criado: ${p.fullName}`)
      } catch { console.warn(`[Seed] Paciente ${p.fullName} skip`) }
    }

    const today = new Date()
    const fmtDT = (d: Date, h: number, m: number) => {
      const dt = new Date(d)
      dt.setHours(h, m, 0, 0)
      return dt.toISOString()
    }

    const patientIds = Object.values(patients)
    const profIds = Object.values(profs)
    const roomIds = Object.values(rooms)

    if (patientIds.length > 0 && profIds.length > 0) {
      const appointments = [
        { patientId: patientIds[0], professionalId: profIds[0], roomId: roomIds[0], startTime: fmtDT(today, 8, 0), endTime: fmtDT(today, 8, 50), notes: 'TCC — Sessão de acompanhamento' },
        { patientId: patientIds[1], professionalId: profIds[0], roomId: roomIds[0], startTime: fmtDT(today, 9, 0), endTime: fmtDT(today, 9, 50), notes: 'Psicanálise — Anamnese inicial' },
        { patientId: patientIds[2], professionalId: profIds[0], roomId: roomIds[2], startTime: fmtDT(today, 10, 30), endTime: fmtDT(today, 11, 20), notes: 'Teleconsulta — Primeira sessão' },
        { patientId: patientIds[3], professionalId: profIds[0], roomId: roomIds[0], startTime: fmtDT(today, 14, 0), endTime: fmtDT(today, 14, 50), notes: 'TCC — Técnicas de regulação' },
        { patientId: patientIds[4], professionalId: profIds[0], roomId: roomIds[1], startTime: fmtDT(today, 15, 30), endTime: fmtDT(today, 16, 20), notes: 'Avaliação psicológica' },
        { patientId: patientIds[5], professionalId: profIds[0], roomId: roomIds[0], startTime: fmtDT(today, 16, 30), endTime: fmtDT(today, 17, 20), notes: 'TCC — Plano terapêutico' },
      ]

      for (const apt of appointments) {
        try {
          await api.post('/appointments', apt)
          console.log('[Seed] ✓ Agendamento criado')
        } catch { console.warn('[Seed] Agendamento skip') }
      }
    }

    for (let i = 0; i < Math.min(3, patientIds.length); i++) {
      try {
        await api.post('/prontuarios', {
          patientId: patientIds[i],
          notes: 'Paciente em acompanhamento regular',
          chronicConditions: i === 0 ? 'Ansiedade generalizada' : '',
          medications: '',
          allergies: '',
        })
        console.log(`[Seed] ✓ Prontuário criado para paciente ${i + 1}`)
      } catch { console.warn(`[Seed] Prontuário ${i} skip`) }
    }

    if (patientIds.length > 0 && profIds.length > 0) {
      const invoices = [
        { patientId: patientIds[0], professionalId: profIds[0], paymentMethod: 'pix', notes: 'Sessão de acompanhamento', amount: 150.00, status: 'PAID' },
        { patientId: patientIds[1], professionalId: profIds[0], paymentMethod: 'credit_card', notes: 'Anamnese inicial', amount: 200.00, status: 'PAID' },
        { patientId: patientIds[2], professionalId: profIds[0], paymentMethod: 'pix', notes: 'Primeira sessão', amount: 150.00, status: 'PENDING' },
        { patientId: patientIds[3], professionalId: profIds[0], paymentMethod: 'pix', notes: 'Sessão de regulação', amount: 150.00, status: 'PENDING' },
      ]
      for (const inv of invoices) {
        try {
          await api.post('/invoices', inv)
          console.log('[Seed] ✓ Fatura criada')
        } catch { console.warn('[Seed] Fatura skip') }
      }
    }

    console.log('[Seed] ✅ Seed concluído com sucesso! Recarregue a página.')
    return { success: true }
  } catch (err) {
    console.error('[Seed] ❌ Erro no seed:', err)
    return { success: false, error: err }
  }
}
