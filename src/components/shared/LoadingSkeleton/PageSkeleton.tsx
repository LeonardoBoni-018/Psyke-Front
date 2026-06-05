export function PageSkeleton() {
  return (
    <div className="page-enter space-y-4 p-6">
      <div className="h-[36px] w-48 animate-shimmer rounded-lg" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-44 animate-shimmer rounded-2xl" />
        <div className="h-44 animate-shimmer rounded-2xl" />
        <div className="h-44 animate-shimmer rounded-2xl lg:col-span-2" />
        <div className="h-36 animate-shimmer rounded-2xl lg:col-span-2" />
      </div>
    </div>
  )
}
