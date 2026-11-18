import { useLayoutEffect, useRef, useState } from 'react'
import { slotLabel, windowLabel } from '../lib/aqi.js'
import { aqiColor, band } from '../components/ui.jsx'
import s from './Forecast.module.css'

const PAD = { top: 16, right: 14, bottom: 32, left: 40 }
const TENSION = 0.38 // sama dengan Chart.js di v3.2

// Titik kendali kurva halus (cara yang sama dengan spline Chart.js).
function controlPoints(pts) {
  return pts.map((p, i) => {
    const a = pts[i - 1]
    const b = pts[i + 1]
    if (!a || !b) return { prev: p, next: p }
    const d01 = Math.hypot(p[0] - a[0], p[1] - a[1])
    const d12 = Math.hypot(b[0] - p[0], b[1] - p[1])
    const s01 = d01 + d12 ? d01 / (d01 + d12) : 0.5
    const fa = TENSION * s01
    const fb = TENSION * (1 - s01)
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    return {
      prev: [p[0] - fa * dx, p[1] - fa * dy],
      next: [p[0] + fb * dx, p[1] + fb * dy],
    }
  })
}

// Grafik garis buatan sendiri: 12 titik tidak butuh library grafik.
// Digambar pada lebar pixel sebenarnya, jadi teks tidak mengecil di HP.
// Tiap ruas garis berwarna sesuai kategori AQI di titik tujuannya.
export default function ForecastChart({ name, values }) {
  const box = useRef(null)
  const [width, setWidth] = useState(0)
  const [active, setActive] = useState(null)

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(box.current)
    return () => ro.disconnect()
  }, [])

  const narrow = width < 520
  const H = narrow ? 230 : 265
  const max = Math.max(150, Math.ceil(Math.max(...values) / 50) * 50)
  const plotW = Math.max(0, width - PAD.left - PAD.right)
  const plotH = H - PAD.top - PAD.bottom
  const x = (i) => PAD.left + (i * plotW) / (values.length - 1)
  const y = (v) => PAD.top + plotH - (v / max) * plotH
  const clampY = (v) => Math.min(y(0), Math.max(PAD.top, v))
  const ticks = Array.from({ length: max / 50 + 1 }, (_, i) => i * 50)

  const pts = values.map((v, i) => [x(i), y(v)])
  const cps = controlPoints(pts)
  const seg = (i) =>
    `C${cps[i].next[0]},${clampY(cps[i].next[1])} ${cps[i + 1].prev[0]},${clampY(cps[i + 1].prev[1])} ${pts[i + 1][0]},${pts[i + 1][1]}`
  const segments = values.slice(0, -1).map((_, i) => `M${pts[i][0]},${pts[i][1]}${seg(i)}`)
  const area =
    `M${pts[0][0]},${pts[0][1]}` +
    values.slice(0, -1).map((_, i) => seg(i)).join('') +
    `L${x(values.length - 1)},${y(0)}L${x(0)},${y(0)}Z`

  function onPointerMove(e) {
    const left = e.currentTarget.getBoundingClientRect().left
    const i = Math.round(((e.clientX - left - PAD.left) / plotW) * (values.length - 1))
    setActive(Math.min(values.length - 1, Math.max(0, i)))
  }

  return (
    <div ref={box} className={s.chart} style={{ height: H }}>
      {width > 0 && (
        <svg
          width={width}
          height={H}
          role="img"
          aria-label={`Grafik AQI ${name} per dua jam. Data lengkap ada di tabel di bawah grafik.`}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
        >
          {ticks.map((t) => (
            <g key={t} className={s.tick}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} />
              <text x={PAD.left - 8} y={y(t)} dy="0.35em" textAnchor="end">{t}</text>
            </g>
          ))}
          {values.map((_, i) =>
            narrow && i % 3 ? null : (
              <text key={i} className={s.xLabel} x={x(i)} y={H - 8} textAnchor="middle">{slotLabel(i)}</text>
            ),
          )}

          <g key={name}>
            <path className={s.area} d={area} />
            {segments.map((d, i) => (
              <path
                key={i}
                className={s.line}
                d={d}
                pathLength="1"
                style={{ stroke: aqiColor(values[i + 1]), '--i': i }}
              />
            ))}
            {active !== null && (
              <line className={s.guide} x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} />
            )}
            {values.map((v, i) => (
              <circle
                key={i}
                className={s.point}
                cx={x(i)}
                cy={y(v)}
                r={active === i ? 8 : 5}
                style={{ '--c': aqiColor(v), '--i': i }}
              />
            ))}
          </g>
        </svg>
      )}

      {active !== null && (
        <div
          className={s.tooltip}
          style={{ left: x(active), top: y(values[active]) }}
          data-flip={x(active) > width - 170 ? '' : undefined}
          aria-hidden="true"
        >
          <strong>{windowLabel(active)}</strong>
          <span>AQI simulasi {values[active]} · {band(values[active]).label}</span>
        </div>
      )}
    </div>
  )
}
