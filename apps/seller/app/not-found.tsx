import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <p className="text-7xl mb-6">🧵</p>
      <h1 className="font-display font-bold text-3xl text-[#2A1F14] mb-2">Page not found</h1>
      <p className="text-[#2A1F14]/50 text-sm max-w-xs leading-relaxed mb-8">
        Looks like this thread leads nowhere. Let&apos;s get you back to your shop.
      </p>
      <Link
        href="/dashboard"
        className="bg-[#E27D60] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#c85c3a] transition-colors"
      >
        Go to dashboard
      </Link>
    </div>
  )
}
