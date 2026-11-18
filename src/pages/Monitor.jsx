import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { LocateFixed, Search } from 'lucide-react'
import { cities, findCity } from '../data/cities.js'
import { ACTIVITIES, dominantPollutant, level, nearestCity, num, verdict } from '../lib/aqi.js'
import { useToast } from '../lib/toast.jsx'
import {
  Act, ActGrid, aqiColor, band, Chips, Dot, Kicker, PageHeader, Reveal,
} from '../components/ui.jsx'
import AirMap from './AirMap.jsx'
import s from './Monitor.module.css'

const FILTERS = [
  ['all', 'Semua'],
  ['good', 'Baik'],
  ['moderate', 'Sedang'],
  ['poor', 'Tidak sehat'],
]

const matches = (c, filter, query) =>
  (filter === 'all' || band(c.aqi).key === filter) &&
  c.name.toLowerCase().includes(query.trim().toLowerCase())

const ACTIVITY_ICON = { run: '🏃', bike: '🚲', kids: '🧒', mask: '😷' }
const VERDICT_TONE = { ok: 'ok', caution: 'mid', avoid: 'no' }
const VERDICT_NOTE = {
  ok: 'Silakan, kondisi mendukung.',
  caution: 'Batasi durasi, pantau gejala.',
  avoid: 'Pilih di dalam ruangan.',
}

// Angka AQI naik dari 0 ke nilai akhir (600 ms). Tanpa animasi bila pengguna meminta gerak dikurangi.
function useCountUp(target, ms = 600) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let raf
    const t0 = performance.now()
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms)
      setValue(Math.round(target * k))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return value
}

export default function Monitor() {
  const toast = useToast()
  const [params] = useSearchParams()
  const [name, setName] = useState(() => findCity(params.get('kota')).name)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const city = findCity(name)
  const visible = useMemo(() => cities.filter((c) => matches(c, filter, query)), [filter, query])

  function select(next) {
    setName(next)
    // Jaga URL tetap bisa dibagikan tanpa navigasi router (tanpa transisi halaman, tanpa reset scroll).
    history.replaceState(history.state, '', `?kota=${encodeURIComponent(next)}`)
  }

  function changeFilter(key) {
    setFilter(key)
    const first = cities.find((c) => matches(c, key, query))
    if (first && !matches(city, key, query)) select(first.name)
  }

  function locate() {
    if (!navigator.geolocation) return toast('Perangkat ini tidak mendukung lokasi. Pilih kota dari daftar.')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = nearestCity(cities, coords.latitude, coords.longitude)
        setFilter('all')
        setQuery('')
        select(nearest.name)
        toast(`Kota terdekat dari lokasimu: ${nearest.name}`)
      },
      () => toast('Izin lokasi ditolak. Pilih kota dari daftar.'),
    )
  }

  function copyLink() {
    navigator.clipboard
      ?.writeText(location.href)
      .then(() => toast('Tautan kota disalin.'))
      .catch(() => toast('Tautan tidak bisa disalin. Salin dari bilah alamat.'))
  }

  return (
    <div className="container page">
      <title>Air Monitor — KADAR Kabar Udara</title>
      <PageHeader crumb="Air Monitor" title={<>Udara setiap kota,<br /><em>dalam satu pandangan.</em></>}>
        Pilih titik pada peta atau daftar untuk melihat AQI, polutan, dan saran aktivitas.
      </PageHeader>

      <div className={s.filterRow}>
        <Chips label="Saring menurut kategori" options={FILTERS} value={filter} onChange={changeFilter} />
        <button type="button" className="btn" onClick={locate}>
          <LocateFixed size={15} aria-hidden="true" />
          Kota terdekat dari lokasiku
        </button>
      </div>

      {city.aqi > 100 && (
        <div className={s.alertBar} role="status">
          <b>⚠ Air Alert</b> Udara di {city.name} sedang tidak sehat. Batasi aktivitas di luar ruangan.
        </div>
      )}

      <div className={s.layout}>
        <div className={s.mapPanel}>
          <div className={s.panelTop}>
            <div>
              <Kicker>PETA KUALITAS UDARA INDONESIA</Kicker>
              <h2>Peta interaktif</h2>
            </div>
            <span className={s.demoPill}><i aria-hidden="true" /> DATA DEMO</span>
          </div>
          <AirMap cities={visible} selected={city} onSelect={select} />
          <div className={s.legend}>
            <span><i className={`${s.legendDot} ${s.lgGood}`} aria-hidden="true" /> Baik</span>
            <span><i className={`${s.legendDot} ${s.lgModerate}`} aria-hidden="true" /> Sedang</span>
            <span><i className={`${s.legendDot} ${s.lgPoor}`} aria-hidden="true" /> Tidak sehat</span>
            <span className={s.hint}>Zoom dengan tombol +/−</span>
          </div>
        </div>

        <aside className={s.cityPanel}>
          <div>
            <Kicker>CITY OVERVIEW</Kicker>
            <h2>Pilih kotamu</h2>
          </div>
          <label className={s.search}>
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Cari kota</span>
            <input type="search" placeholder="Cari kota..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>

          {visible.length ? (
            <ul className={s.list}>
              {visible.map((c) => (
                <li key={c.name}>
                  <button type="button" className={s.row} aria-pressed={c.name === name} onClick={() => select(c.name)}>
                    <Dot aqi={c.aqi} />
                    <span className={s.rowName}>
                      {c.name}
                      <small>{c.region}</small>
                    </span>
                    <b className={`${s.rowAqi} num`}>{c.aqi}</b>
                    <span className={s.rowState}>{band(c.aqi).label}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={s.empty}>
              <p>Tidak ada kota yang cocok dengan “{query}”. Ubah filter atau kata kunci.</p>
              <button type="button" className="btn" onClick={() => { setQuery(''); setFilter('all') }}>
                Tampilkan semua kota
              </button>
            </div>
          )}
        </aside>
      </div>

      <CityDetail city={city} />

      <ActGrid>
        {ACTIVITIES.map((a) => {
          const v = verdict(city.aqi, a)
          return (
            <Act key={a.id} title={`${ACTIVITY_ICON[a.id]} ${a.name}`} badge={v.label} tone={VERDICT_TONE[v.key]}>
              {VERDICT_NOTE[v.key]}
            </Act>
          )
        })}
      </ActGrid>

      <div className={s.actions}>
        <Link className="btn btn-primary" to={`/prakiraan?kota=${city.name}`}>Lihat prediksi kota ini</Link>
        <button type="button" className="btn" onClick={copyLink}>Salin tautan kota</button>
      </div>
    </div>
  )
}

function CityDetail({ city }) {
  const lv = level(city.aqi)
  const st = band(city.aqi)
  const shown = useCountUp(city.aqi)
  const icon = st.key === 'good' ? '✦' : st.key === 'moderate' ? '!' : '⚠'

  return (
    <Reveal as="section" className={s.detail} aria-labelledby="kota-terpilih">
      <div className={s.detailMain}>
        <div className={s.location}>
          <Kicker>KONDISI TERPILIH</Kicker>
          <h2 id="kota-terpilih">{city.name}, {city.region}</h2>
          <span>Data simulasi · bukan pengukuran real-time</span>
        </div>
        <div className={s.score}>
          <strong aria-hidden="true" style={{ color: aqiColor(city.aqi) }}>{shown}</strong>
          <span className="sr-only">AQI {city.aqi}</span>
          <span className={s.scoreMeta}>
            <b style={{ color: aqiColor(city.aqi) }}>{st.label}</b>
            <small>US AQI</small>
          </span>
        </div>
      </div>

      <div className={s.advice}>
        <div className={`${s.adviceIcon} ${s[st.key]}`} aria-hidden="true">{icon}</div>
        <div>
          <b>{lv.advice}</b>
          <p>{lv.detail}</p>
        </div>
      </div>

      <dl className={s.pollutants}>
        <div><dt>PM2.5</dt><dd>{num.format(city.pm25)} <small>µg/m³</small></dd></div>
        <div><dt>PM10</dt><dd>{num.format(city.pm10)} <small>µg/m³</small></dd></div>
        <div><dt>DOMINAN</dt><dd>{dominantPollutant(city)}</dd></div>
        <div><dt>SUHU</dt><dd>{city.temp}° <small>C</small></dd></div>
      </dl>
    </Reveal>
  )
}
