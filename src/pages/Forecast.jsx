import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { cities, findCity } from '../data/cities.js'
import { hourly } from '../data/forecast.js'
import { average, bestSlot, level, slotLabel, windowLabel, worstSlot } from '../lib/aqi.js'
import { Act, ActGrid, band, Kicker, PageHeader, Reveal } from '../components/ui.jsx'
import ForecastChart from './ForecastChart.jsx'
import s from './Forecast.module.css'

export default function Forecast() {
  const [params] = useSearchParams()
  const [name, setName] = useState(() => findCity(params.get('kota')).name)
  const values = hourly[name]
  const avg = average(values)
  const best = bestSlot(values)
  const worst = worstSlot(values)
  const improving = values.at(-1) < values[0]

  function choose(next) {
    setName(next)
    history.replaceState(history.state, '', `?kota=${encodeURIComponent(next)}`)
  }

  return (
    <div className="container page">
      <title>Air Forecast — KADAR Kabar Udara</title>
      <PageHeader crumb="Air Forecast" title={<>Kenali pola udara,<br /><em>rencanakan harimu.</em></>}>
        Simulasi perubahan AQI 24 jam ke depan. Warna garis menunjukkan kategori udara.
      </PageHeader>

      <Reveal as="section" className={s.card} aria-labelledby="judul-prakiraan">
        <div className={s.toolbar}>
          <div>
            <Kicker>PREDIKSI KUALITAS UDARA</Kicker>
            <h2 id="judul-prakiraan">{name} · 24 jam ke depan</h2>
          </div>
          <label className={s.select}>
            <span className="sr-only">Pilih kota</span>
            <select value={name} onChange={(e) => choose(e.target.value)}>
              {cities.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
          </label>
        </div>

        <dl className={s.summary}>
          <div><dt>RATA-RATA AQI</dt><dd className="num">{avg}</dd></div>
          <div><dt>WAKTU TERBAIK</dt><dd className="num">{windowLabel(best)}</dd></div>
          <div>
            <dt>TREN</dt>
            <dd className={improving ? s.up : undefined}>{improving ? '↘ Cenderung membaik' : '↗ Perlu dipantau'}</dd>
          </div>
        </dl>

        <ForecastChart name={name} values={values} />

        <div className={s.legend}>
          <span><i className={`${s.legendDot} ${s.lgGood}`} aria-hidden="true" /> Baik (0–50)</span>
          <span><i className={`${s.legendDot} ${s.lgModerate}`} aria-hidden="true" /> Sedang (51–100)</span>
          <span><i className={`${s.legendDot} ${s.lgPoor}`} aria-hidden="true" /> Tidak sehat (101+)</span>
          <small>Simulasi data untuk demonstrasi, bukan prediksi aktual.</small>
        </div>

        <details className={s.table}>
          <summary>Lihat data sebagai tabel</summary>
          <table>
            <thead>
              <tr><th scope="col">Pukul</th><th scope="col">AQI</th><th scope="col">Kategori</th></tr>
            </thead>
            <tbody>
              {values.map((v, i) => (
                <tr key={i}>
                  <th scope="row" className="num">{slotLabel(i)}</th>
                  <td className="num">{v}</td>
                  <td>{level(v).label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </Reveal>

      <ActGrid>
        <Act title="Waktu terbaik">
          Jadwalkan olahraga pukul {windowLabel(best)}, saat AQI paling rendah ({values[best]}).
        </Act>
        <Act title="Puncak polusi">
          Hindari aktivitas berat sekitar pukul {windowLabel(worst)}, saat AQI mencapai {values[worst]}.
        </Act>
        <Act title="Siapkan rencana">
          Rata-rata hari ini {level(avg).label.toLowerCase()}. {level(avg).advice}
        </Act>
      </ActGrid>

      <div className={s.actions}>
        <Link className="btn btn-primary" to={`/pantau?kota=${name}`}>Lihat kondisi {name} sekarang</Link>
      </div>
    </div>
  )
}
