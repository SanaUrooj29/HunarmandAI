import clsx from 'clsx'

// ─── Skeleton Loader ───────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton', className)} />
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e6d8cc] space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

// ─── Status Pill ──────────────────────────────────────────────────────────────
const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'pill-pending' },
  accepted: { label: 'Accepted', className: 'bg-[#1F7A8C]/10 text-[#1F7A8C]' },
  preparing: { label: 'Preparing', className: 'bg-amber-100 text-amber-700' },
  shipped: { label: 'Shipped', className: 'pill-transit' },
  delivered: { label: 'Delivered', className: 'pill-delivered' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600' },
  NEW: { label: 'New', className: 'bg-[#E27D60]/10 text-[#E27D60]' },
  PAYOUT_IN_36H: { label: 'Payout in 36h', className: 'pill-delivered' },
}

export function StatusPill({ status }: { status: string }) {
  const s = statusMap[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide', s.className)}>
      {s.label}
    </span>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}

export function StatCard({ label, value, sub, highlight }: StatCardProps) {
  return (
    <div className={clsx(
      'rounded-2xl p-4 flex flex-col gap-1',
      highlight ? 'bg-[#1F7A8C] text-white' : 'bg-white border border-[#e6d8cc]'
    )}>
      <p className={clsx('text-xs font-medium uppercase tracking-wider', highlight ? 'text-white/60' : 'text-[#2A1F14]/50')}>
        {label}
      </p>
      <p className={clsx('font-display font-bold text-2xl', highlight ? 'text-white' : 'text-[#2A1F14]')}>
        {value}
      </p>
      {sub && <p className={clsx('text-xs', highlight ? 'text-white/70' : 'text-[#2A1F14]/50')}>{sub}</p>}
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, action, actionHref }: { title: string; action?: string; actionHref?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-semibold text-[#2A1F14]">{title}</h2>
      {action && (
        <a href={actionHref ?? '#'} className="text-sm text-[#E27D60] font-medium hover:underline">
          {action}
        </a>
      )}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md',
      variant === 'success' && 'bg-emerald-50 text-emerald-700',
      variant === 'warning' && 'bg-amber-50 text-amber-700',
      variant === 'default' && 'bg-[#1F7A8C]/10 text-[#1F7A8C]',
    )}>
      {children}
    </span>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-95',
        variant === 'primary' && 'bg-[#E27D60] text-white hover:bg-[#c85c3a]',
        variant === 'secondary' && 'bg-white text-[#2A1F14] border border-[#e6d8cc] hover:border-[#1F7A8C]',
        variant === 'ghost' && 'text-[#E27D60] hover:bg-[#E27D60]/10',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3.5 text-base w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── Order Card ───────────────────────────────────────────────────────────────
interface OrderCardProps {
  id: string
  product: string
  buyer: string
  price: string
  status: string
  action?: string
}

export function OrderCard({ id, product, buyer, price, status, action }: OrderCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e6d8cc] p-4 flex items-center gap-3">
      <div className="w-12 h-12 bg-[#F5EBDD] rounded-xl flex-shrink-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-[#E27D60]/20 rounded-lg" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-[#2A1F14] text-sm truncate">{product}</p>
          <p className="font-bold text-[#2A1F14] text-sm whitespace-nowrap">{price}</p>
        </div>
        <p className="text-xs text-[#2A1F14]/50 mt-0.5">{buyer} · {id}</p>
        <div className="flex items-center justify-between mt-2">
          <StatusPill status={status} />
          {action && (
            <button className="text-xs font-semibold text-[#1F7A8C] hover:underline">{action}</button>
          )}
        </div>
      </div>
    </div>
  )
}
