import { useCallback, useEffect, useRef, useState } from 'react'
import s from './Intro.module.css'

const SEEN = 'kadar-intro'

// Diputuskan sekali, sebelum React render, supaya <html data-intro> sudah terpasang saat halaman muncul.
export function shouldPlayIntro() {
  if (location.pathname !== '/') return false
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    if (sessionStorage.getItem(SEEN)) return false
    sessionStorage.setItem(SEEN, '1')
    return true
  } catch {
    return false
  }
}

export default function Intro({ onDone }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    setLeaving(true)
    setTimeout(onDone, 700)
  }, [onDone])

  useEffect(() => {
    addEventListener('keydown', finish, { once: true })
    return () => removeEventListener('keydown', finish)
  }, [finish])

  useEffect(() => {
    let raf
    let doneTimer
    const t0 = performance.now()
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 2600)
      const e = 1 - Math.pow(1 - k, 2)
      setPct(Math.round(e * 100))
      if (k < 1) raf = requestAnimationFrame(step)
      else doneTimer = setTimeout(finish, 350)
    }
    raf = requestAnimationFrame(step)
    return () => {
      clearTimeout(doneTimer)
      cancelAnimationFrame(raf)
    }
  }, [finish])

  return (
    <div className={`${s.intro} ${leaving ? s.hide : ''}`} role="dialog" aria-modal="true" aria-label="Pembuka KADAR">
      <div className={`${s.stage} ${s.on}`}>
        <h2 className={s.title}>Selamat Datang di Kadar</h2>
        <p className={s.sub}>Kabar Udara · pantau, pahami, lindungi</p>
        <div
          className={s.bar}
          role="progressbar"
          aria-label="Memuat KADAR"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={pct}
        >
          <i style={{ width: `${pct}%` }} />
        </div>
        <small className={`${s.pct} num`}>{pct}%</small>
      </div>

      <button type="button" className={s.skip} onClick={finish}>Lewati ↗</button>
    </div>
  )
}