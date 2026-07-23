export default function Loading() {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4 animate-pulse">
      <div className="skeleton rounded-2xl h-44 w-full" />
      <div className="skeleton rounded-2xl h-16 w-full" />
      <div className="grid grid-cols-3 gap-3">
        <div className="skeleton rounded-xl h-20" />
        <div className="skeleton rounded-xl h-20" />
        <div className="skeleton rounded-xl h-20" />
      </div>
      <div className="skeleton rounded-xl h-5 w-32" />
      <div className="space-y-2">
        <div className="skeleton rounded-xl h-20 w-full" />
        <div className="skeleton rounded-xl h-20 w-full" />
        <div className="skeleton rounded-xl h-20 w-full" />
      </div>
    </div>
  )
}
