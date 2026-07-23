import { starArray } from '@/lib/utils'

export function StarRating({ rating, count, size = 'sm' }: { rating: number; count?: number; size?: 'sm'|'md'|'lg' }) {
  const stars = starArray(rating)
  const px = size === 'lg' ? 20 : size === 'md' ? 16 : 13
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <span style={{ display: 'inline-flex', gap: 1 }}>
        {stars.map((s, i) => (
          <svg key={i} width={px} height={px} viewBox="0 0 16 16" fill="none">
            {s === 'full' && <polygon points="8,1 10,6 15,6 11,10 12.5,15 8,12 3.5,15 5,10 1,6 6,6" fill="#F5A623"/>}
            {s === 'half' && (<><defs><linearGradient id={`h${i}`}><stop offset="50%" stopColor="#F5A623"/><stop offset="50%" stopColor="#D9D0C4"/></linearGradient></defs><polygon points="8,1 10,6 15,6 11,10 12.5,15 8,12 3.5,15 5,10 1,6 6,6" fill={`url(#h${i})`}/></>)}
            {s === 'empty' && <polygon points="8,1 10,6 15,6 11,10 12.5,15 8,12 3.5,15 5,10 1,6 6,6" fill="#D9D0C4"/>}
          </svg>
        ))}
      </span>
      <span style={{ fontSize: size === 'lg' ? 15 : size === 'md' ? 13 : 12, color: '#8C7D6B', fontWeight: 500 }}>
        {rating.toFixed(1)}{count !== undefined && ` · ${count} reviews`}
      </span>
    </span>
  )
}
