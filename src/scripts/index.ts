if (import.meta.env.DEV) {
  import('./seedDemoData').then(({ seedDemoData }) => {
    ;(window as any).__psykeSeed = seedDemoData
    console.log('[Psyke Dev] Seed disponível: window.__psykeSeed()')
  })
}
