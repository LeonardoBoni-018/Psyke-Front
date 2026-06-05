# Psyke UI — Skill de Layouts

Templates de layout para cada tipo de página. Copie e adapte.

---

## Dashboard

```tsx
// Grid: sidebar 220px (métricas empilhadas) + coluna principal 1fr
export default function DashboardPage() {
  return (
    <div className="page-enter" style={{ padding: 28 }}>
      {/* Header */}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'start' }}>
        {/* Sidebar: 3 StatCards empilhados (Hoje, Pacientes, Financeiro) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StatCard label="Sessões hoje" value={7} delta="+2" deltaPositive icon={<Calendar size={20} />} />
          <StatCard label="Pacientes ativos" value={142} icon={<Users size={20} />} />
          <StatCard label="Faturamento" value="R$ 12.450" delta="-8%" icon={<DollarSign size={20} />} />
        </div>

        {/* Coluna principal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Card "Sessões de hoje" com timeline */}
          <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>Sessões de hoje</span>
            </div>
            {sessions.map((s, i) => <SessionRow key={s.id} session={s} index={i} onClick={() => {}} />)}
          </div>

          {/* Acesso rápido */}
          <PageHeader title="Acesso rápido" />
          <div style={{ display: 'flex', gap: 12 }}>
            <ActionCard icon={<UserPlus size={18} />} label="Novo Paciente" description="Cadastrar novo paciente no sistema" onClick={() => navigate('/patients/new')} />
            <ActionCard icon={<CalendarPlus size={18} />} label="Agendar Sessão" description="Criar novo agendamento na agenda" onClick={() => navigate('/agenda/new')} accentColor="var(--amber)" />
            <ActionCard icon={<FileText size={18} />} label="Nova Evolução" description="Registrar evolução clínica" onClick={() => navigate('/prontuarios/new')} accentColor="var(--info)" />
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Lista Paginada

```tsx
// Estrutura: Topbar | Tabs | Tabela (stagger) | Paginação
export default function ListPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Topbar com search + ações */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-1)' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
            style={{ width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 12px 8px 32px', fontSize: 13, color: 'var(--text-1)', outline: 'none', fontFamily: 'var(--font-sans)' }} />
        </div>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" icon={<Filter size={13} />}>Filtros</Button>
        <Button variant="primary" size="sm" icon={<UserPlus size={14} />}>Novo</Button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-1)' }}>
        {[{ key: 'all', label: 'Todos' }, { key: 'active', label: 'Ativos' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '11px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
            borderBottom: `2px solid ${tab === t.key ? 'var(--teal)' : 'transparent'}`,
            color: tab === t.key ? 'var(--teal)' : 'var(--text-3)', fontSize: 12, fontWeight: 500,
            fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 6,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Nome', 'Status', ''].map(h => (
              <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontWeight: 400,
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                borderBottom: '1px solid var(--border)', background: 'var(--bg-1)', position: 'sticky', top: 0 }}>
                {h}
              </th>
            ))}</tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className="item-enter" style={{ animationDelay: `${i * 35}ms`, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--teal-10)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '11px 18px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={item.name} size={26} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{item.name}</span>
                  </div>
                </td>
                <td style={{ padding: '11px 18px', borderBottom: '1px solid var(--border)' }}>
                  <Badge status={item.status} />
                </td>
                <td style={{ padding: '11px 18px', borderBottom: '1px solid var(--border)' }}>
                  <ChevronRight size={13} style={{ color: 'var(--text-3)' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-1)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
          Mostrando 1-10 de {total}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="ghost" size="sm">← Anterior</Button>
          <Button variant="ghost" size="sm">Próximo →</Button>
        </div>
      </div>
    </div>
  )
}
```

---

## Detalhe com Sidebar

```tsx
// Grid: sidebar 280px | main 1fr
export default function DetailPage() {
  const [activeTab, setActiveTab] = useState('tab1')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: '100%', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={data.name} size={44} />
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--text-1)' }}>{data.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', marginTop: 3 }}>{data.detail}</div>
          </div>
        </div>
        <Divider />
        <SectionLabel>Identificação</SectionLabel>
        <InfoRow label="Campo" value={data.field1} mono />
        <InfoRow label="Status" value={<Badge status={data.status} />} />
      </div>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 20px', background: 'var(--bg-1)' }}>
          {[{ key: 'tab1', label: 'Aba 1' }, { key: 'tab2', label: 'Aba 2' }].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
              borderBottom: `2px solid ${activeTab === t.key ? 'var(--teal)' : 'transparent'}`,
              color: activeTab === t.key ? 'var(--teal)' : 'var(--text-3)', fontSize: 13, fontWeight: 500,
              fontFamily: 'var(--font-sans)',
            }}>{t.label}</button>
          ))}
        </div>
        <div key={activeTab} className="page-enter"
          style={{ flex: 1, overflowY: 'auto', padding: 20, animationDuration: '0.15s' }}>
          {activeTab === 'tab1' && <div>Conteúdo</div>}
        </div>
      </div>
    </div>
  )
}
```

---

## Modal (Radix Dialog)

```tsx
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Portal>
    <Dialog.Overlay className="animate-fade-in" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', zIndex: 40,
    }} />
    <Dialog.Content className="animate-scale-in" style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)',
      width: '90vw', maxWidth: 500, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 50,
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Dialog.Title style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--text-1)', margin: 0 }}>Título</Dialog.Title>
        <Dialog.Close asChild>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4, borderRadius: 'var(--radius-sm)' }}>
            <X size={16} />
          </button>
        </Dialog.Close>
      </div>
      {/* Body */}
      <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
        {/* formulário / conteúdo */}
      </div>
      {/* Footer */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8, background: 'var(--bg-2)' }}>
        <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
        <Button variant="primary" loading={isPending}>Salvar</Button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

---

## Drawer Lateral

```tsx
{isOpen && (
  <>
    <div className="animate-fade-in" onClick={() => setOpen(false)}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />
    <div className="animate-slide-right" style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
      background: 'var(--bg-1)', borderLeft: '1px solid var(--border)',
      zIndex: 50, overflowY: 'auto', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--text-1)' }}>Detalhes</span>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
          <X size={16} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {/* conteúdo */}
      </div>
    </div>
  </>
)}
```
