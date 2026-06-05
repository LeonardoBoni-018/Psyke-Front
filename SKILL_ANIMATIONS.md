# Psyke UI — Skill de Animações e Transições

Referência: Linear, Vercel, Raycast — animações funcionais, nunca decorativas.

## Princípios

| Regra | Detalhe |
|-------|---------|
| Duração | Entrada 200-250ms, transição 120-150ms, nunca >400ms |
| Easing | `ease` ou `cubic-bezier(0.16, 1, 0.3, 1)` |
| Stagger | Listas com delay escalonado de 35-50ms entre itens |
| Propósito | Animação serve à função, não à decoração |
| Acessibilidade | `prefers-reduced-motion: reduce` desliga tudo |

## Keyframes (já em globals.css)

| Classe | Uso |
|--------|-----|
| `.page-enter` | Container raiz de cada página |
| `.item-enter` + `animationDelay` | Linhas de lista com stagger |
| `.animate-shimmer` | Skeleton loading |
| `.animate-pulse-live` | Indicador de sessão ao vivo |
| `.animate-spin` | Loading spinner |
| `.animate-fade-in` | Overlay de modal/drawer |
| `.animate-scale-in` | Conteúdo de modal/dialog |
| `.animate-slide-right` | Drawer lateral (direita) |
| `.animate-slide-left` | Drawer lateral (esquerda) |

## Padrões de Código

### Lista com stagger
```tsx
{items.map((item, i) => (
  <div key={item.id} className="item-enter"
    style={{ animationDelay: `${i * 40}ms` }}>
    {/* conteúdo */}
  </div>
))}
```

### Skeleton loading com opacidade progressiva
```tsx
{Array.from({ length: 5 }).map((_, i) => (
  <div key={i} style={{ opacity: 1 - i * 0.12, padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
    <div className="animate-shimmer" style={{ width: 44, height: 13, borderRadius: 4 }} />
    <div style={{ flex: 1 }}>
      <div className="animate-shimmer" style={{ height: 13, width: `${60 + i * 5}%`, borderRadius: 4 }} />
    </div>
  </div>
))}
```

### Indicador ao vivo
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
  <div className="animate-pulse-live" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} />
  <span style={{ fontSize: 11, color: 'var(--teal)', fontFamily: 'var(--font-mono)' }}>Em andamento</span>
</div>
```

### Modal com animação
```tsx
<Dialog.Overlay className="animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', zIndex: 40 }} />
<Dialog.Content className="animate-scale-in" style={{ ... }} />
```

### Botão com loading
```tsx
<button disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
  {loading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
  {loading ? 'Salvando...' : 'Salvar'}
</button>
```

### Hook useCountUp (para números em métricas)
```tsx
function useCountUp(target: number, duration = 600) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}
// Uso: const displayValue = useCountUp(value as number)
```

## O que NÃO fazer
- `transform: scale()` no hover de cards (parece amador)
- `transition: all 0.3s` (usar propriedades específicas)
- `animation-duration > 400ms`
- Bounce / elastic em UI clínica
- Gradientes animados decorativos
- Parallax ou scroll-based animations
- Animações em formulários ativos (distrai)
