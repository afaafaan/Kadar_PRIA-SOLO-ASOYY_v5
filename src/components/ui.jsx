import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import s from './ui.module.css'

// Warna dan label ringkas untuk tampilan: 3 kelompok (baik, sedang, tidak sehat).
// Logika kategori lengkap (6 tingkat) tetap ada di lib/aqi.js.
export const aqiColor = (aqi) =>
  aqi <= 50 ? 'var(--aqi-good)' : aqi <= 100 ? 'var(--aqi-moderate)' : 'var(--aqi-unhealthy)'

export const band = (aqi) =>
  aqi <= 50
    ? { key: 'good', label: 'BAIK' }
    : aqi <= 100
      ? { key: 'moderate', label: 'SEDANG' }
      : { key: 'poor', label: 'TIDAK SEHAT' }

// Muncul pelan saat masuk layar (mengganti IntersectionObserver di app.js v3.2).
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [seen])

  return (
    <Tag ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

// Judul bagian: breadcrumb + judul besar (kata bergaris <em>) + deskripsi di kanan.
export function SectionHeading({ crumb, title, level = 'h2', children }) {
  const Heading = level
  return (
    <Reveal as="header" className={`${s.sectionHeading} ${level === 'h1' ? s.page : ''}`}>
      <div>
        <div className={s.crumb}>
          <Link to="/">Home</Link> / {crumb}
        </div>
        <Heading tabIndex={level === 'h1' ? -1 : undefined}>{title}</Heading>
      </div>
      {children && <p>{children}</p>}
    </Reveal>
  )
}

export const PageHeader = (props) => <SectionHeading level="h1" {...props} />

export function Eyebrow({ children }) {
  return (
    <div className={s.eyebrow}>
      <i aria-hidden="true" /> {children}
    </div>
  )
}

export const Kicker = ({ children }) => <span className={s.kicker}>{children}</span>

export function Dot({ aqi }) {
  return <span className={s.dot} style={{ '--c': aqiColor(aqi) }} aria-hidden="true" />
}

// Filter satu pilihan sebagai tombol chip.
export function Chips({ label, options, value, onChange }) {
  return (
    <div className={s.chips} role="group" aria-label={label}>
      {options.map(([key, text]) => (
        <button
          key={key}
          type="button"
          className={s.chip}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          {text}
        </button>
      ))}
    </div>
  )
}

// Kartu kecil (saran aktivitas, tips prakiraan). `tone`: ok | mid | no.
export function ActGrid({ children, className = '' }) {
  return <div className={`${s.actGrid} ${className}`}>{children}</div>
}

export function Act({ title, badge, tone, children }) {
  return (
    <div className={s.act}>
      {badge && <em className={s[tone]}>{badge}</em>}
      <b>{title}</b>
      <span>{children}</span>
    </div>
  )
}
