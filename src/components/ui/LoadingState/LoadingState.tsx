interface LoadingStateProps {
  lines?: number
}

export function LoadingState({ lines = 5 }: LoadingStateProps) {
  return (
    <div className="space-y-3">
      <div className="h-6 w-48 rounded-lg bg-bg-2 animate-shimmer" />
      <div className="h-4 w-32 rounded-lg bg-bg-2 animate-shimmer" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-14 rounded-lg bg-bg-2 animate-shimmer" />
      ))}
    </div>
  )
}
