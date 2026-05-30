export function PageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-[52px] rounded-2xl bg-bg-1" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-44 rounded-2xl bg-bg-2 shadow-sm" />
        <div className="h-44 rounded-2xl bg-bg-2 shadow-sm" />
        <div className="h-44 rounded-2xl bg-bg-2 shadow-sm lg:col-span-2" />
        <div className="h-36 rounded-2xl bg-bg-2 shadow-sm lg:col-span-2" />
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-bg-2 px-4 py-4">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--bg-2),var(--bg-3),var(--bg-2))] bg-[length:200%_100%] animate-shimmer opacity-80" />
      </div>
    </div>
  )
}
