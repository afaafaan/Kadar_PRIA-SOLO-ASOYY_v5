import { useState } from 'react'
import { Link } from 'react-router'
import { HeartPulse, Microscope, ShieldCheck } from 'lucide-react'
import { LEVELS, rangeOf } from '../lib/aqi.js'
import { PageHeader, Reveal } from '../components/ui.jsx'
import s from './Content.module.css'

const TOPICS = [
  [Microscope, 'Mengenal PM2.5 dan PM10', 'Partikel halus yang dapat masuk jauh ke saluran pernapasan.', 'https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health', 'WHO'],
  [HeartPulse, 'Siapa yang perlu lebih waspada?', 'Anak-anak, lansia, serta penderita gangguan napas atau jantung lebih rentan.', 'https://www.who.int/health-topics/air-pollution', 'WHO'],
  [ShieldCheck, 'Langkah sederhana saat udara buruk', 'Kurangi aktivitas berat di luar dan ikuti saran otoritas kesehatan.', 'https://www.airnow.gov/', 'AirNow'],
]

const FAQ = [
  ['Kapan sebaiknya saya memakai masker?', 'Saat AQI masuk kategori tidak sehat dan kamu harus berada di luar. Pilih masker yang menutup hidung dan mulut dengan rapat.'],
  ['Apakah udara pagi selalu bersih?', 'Tidak selalu. Di beberapa kota polusi justru menumpuk pada pagi hari. Cek halaman Air Forecast untuk waktu terbaik.'],
  ['Mengapa AQI berbeda di tiap aplikasi?', 'Sumber sensor dan standar perhitungannya bisa berbeda. KADAR memakai skala US AQI dan mencantumkan sumber data agar mudah dibandingkan.'],
]

export default function Education() {
  const [active, setActive] = useState(LEVELS[0].key)
  const current = LEVELS.find((l) => l.key === active)

  return (
    <div className="container page">
      <title>Education — KADAR Kabar Udara</title>
      <PageHeader crumb="Education" title={<>Lebih paham udara,<br /><em>lebih siap menjaga diri.</em></>}>
        Kenali istilah, dampak, dan kebiasaan sederhana agar keputusanmu lebih tepat.
      </PageHeader>

      <Reveal className={s.eduLayout}>
        <section className={s.eduFeature} aria-labelledby="skala">
          <h2 id="skala">Apa arti angka<br />kualitas udara?</h2>
          <p>
            AQI adalah indeks untuk menyampaikan tingkat pencemaran udara dan potensi dampaknya
            bagi kesehatan. Klik kategori untuk melihat artinya.
          </p>
          <a href="https://www.airnow.gov/aqi/aqi-basics/" target="_blank" rel="noopener">
            Pelajari dasar AQI ↗<span className="sr-only"> (membuka tab baru)</span>
          </a>

          <div className={s.aqiScale} role="group" aria-label="Kategori AQI">
            {LEVELS.map((l) => (
              <button
                key={l.key}
                type="button"
                className={s.scaleBox}
                data-k={l.key}
                aria-pressed={l.key === active}
                onClick={() => setActive(l.key)}
              >
                <b className="num">{rangeOf(l)}</b>
                <span>{l.label.toUpperCase()}</span>
                <i />
              </button>
            ))}
          </div>

          <div className={s.scaleInfo} aria-live="polite">
            <strong>{current.advice}</strong>
            <span>{current.detail}</span>
          </div>
        </section>

        <div className={s.eduTopics}>
          {TOPICS.map(([Icon, title, text, url, source]) => (
            <article key={title} className={s.eduTopic}>
              <span className={s.topicIcon}><Icon size={18} aria-hidden="true" /></span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
                <a href={url} target="_blank" rel="noopener">
                  Sumber {source} ↗<span className="sr-only"> (membuka tab baru)</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <h2 className={s.faqTitle}>Pertanyaan yang sering muncul</h2>
      <div className={s.faq}>
        {FAQ.map(([q, a]) => (
          <details key={q} name="faq">
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>

      <div className={s.myth}>
        <h2>Jangan hanya melihat cuaca.<br /><em>Perhatikan juga kualitas udara.</em></h2>
        <Link className="btn btn-primary" to="/pantau">Cek udara sekarang</Link>
      </div>
    </div>
  )
}
