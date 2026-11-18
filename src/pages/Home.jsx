import { Link } from 'react-router'
import { BookOpen, ChartLine, MapPinned, Newspaper } from 'lucide-react'
import { cities } from '../data/cities.js'
import { aqiColor, band, Eyebrow, Reveal, SectionHeading } from '../components/ui.jsx'
import s from './Home.module.css'

const FEATURES = [
  ['/pantau', MapPinned, 'Air Monitor', 'Peta interaktif, AQI per kota, dan saran aktivitas.'],
  ['/prakiraan', ChartLine, 'Air Forecast', 'Grafik prediksi 24 jam dan waktu terbaik keluar rumah.'],
  ['/berita', Newspaper, 'News', 'Kabar lingkungan dari lembaga tepercaya.'],
  ['/edukasi', BookOpen, 'Education', 'Pahami AQI, polutan, dan kelompok rentan.'],
]

export default function Home() {
  const snapshot = cities[0]
  const snapshotBand = band(snapshot.aqi)

  return (
    <>
      <title>Home — KADAR Kabar Udara</title>

      <section className={s.hero} aria-labelledby="judul">
        <div className="container">
          <div className={s.heroGrid}>
            <div className={s.heroCopy}>
              <Eyebrow>KENALI UDARA DI SEKITARMU</Eyebrow>
              <h1 id="judul" tabIndex={-1}>
                Udara yang baik,<br /><em>awal hidup</em> yang lebih baik.
              </h1>
              <p className={s.heroLead}>
                Sebelum melangkah keluar, cari tahu kualitas udara di kotamu. KADAR membantumu
                memahami kondisi udara dan mengambil keputusan dengan lebih bijak.
              </p>
              <div className={s.heroButtons}>
                <Link className="btn btn-primary" to="/pantau">Pantau kualitas udara</Link>
                <Link className={s.textLink} to="/edukasi">Kenali kualitas udara <span aria-hidden="true">→</span></Link>
              </div>
            </div>

            <div className={s.heroVisual}>
              <div className={s.orbit} aria-hidden="true" />
              <div className={`${s.orbit} ${s.orbitTwo}`} aria-hidden="true" />
              <div className={s.sun} aria-hidden="true" />
              <div className={`${s.cloud} ${s.cloudA}`} aria-hidden="true" />
              <div className={`${s.cloud} ${s.cloudB}`} aria-hidden="true" />
              <div className={`${s.wind} ${s.windOne}`} aria-hidden="true" />
              <div className={`${s.wind} ${s.windTwo}`} aria-hidden="true" />
              <div className={`${s.wind} ${s.windThree}`} aria-hidden="true" />

              <div className={`${s.floating} ${s.fcTop}`}>
                <span className="live-dot" aria-hidden="true" /> AIR QUALITY SNAPSHOT <b>DEMO</b>
              </div>
              <div className={`${s.floating} ${s.fcBottom}`}>
                <div className={s.miniLabel}>KUALITAS UDARA HARI INI</div>
                <div className={s.miniScore}>
                  <strong className="num">{snapshot.aqi}</strong>
                  <span style={{ color: aqiColor(snapshot.aqi) }}>{snapshotBand.label}</span>
                </div>
                <div className={s.miniBar} aria-hidden="true">
                  <i style={{ width: `${Math.min(100, snapshot.aqi)}%`, background: aqiColor(snapshot.aqi) }} />
                </div>
                <small>Contoh data · {snapshot.name}</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={s.quickStrip} aria-label="Pantau sekilas">
        <div className={`container ${s.quickContainer}`}>
          <div className={s.quickIntro}>
            <Eyebrow>PANTAU SEKILAS</Eyebrow>
            <strong>Klik kota untuk melihat detail</strong>
          </div>
          <div className={s.quickCities}>
            {cities.slice(0, 4).map((c) => (
              <Link key={c.name} className={s.quickCity} to={`/pantau?kota=${c.name}`}>
                <span>{c.name}</span>
                <div>
                  <strong className="num">{c.aqi}</strong>
                  <small style={{ color: aqiColor(c.aqi) }}>{band(c.aqi).label}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={s.sectionBlock}>
        <div className="container">
          <SectionHeading crumb="Fitur" title={<>Pilih jalurmu,<br /><em>mulai dari sini.</em></>}>
            Setiap fitur punya halamannya sendiri. Klik kartu untuk membukanya.
          </SectionHeading>
          <ul className={s.featGrid}>
            {FEATURES.map(([to, Icon, title, text]) => (
              <Reveal as="li" key={to} className={s.featItem}>
                <Link to={to} className={s.featCard}>
                  <span className={s.featIc}><Icon size={22} strokeWidth={1.9} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <b>Buka halaman <i aria-hidden="true">→</i></b>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={s.aboutSection} aria-labelledby="tentang">
        <div className="container">
          <Reveal className={s.aboutGrid}>
            <div>
              <Eyebrow>TENTANG KADAR</Eyebrow>
              <h2 id="tentang">Cek udara dulu,<br /><em>baru beraktivitas.</em></h2>
            </div>
            <div className={s.aboutCopy}>
              <p>
                Udara tidak selalu terlihat buruk, tetapi dampaknya nyata bagi pernapasan. KADAR
                membantumu melihat kondisi udara sebelum olahraga, berangkat kerja, atau mengantar
                anak ke sekolah.
              </p>
              <Link className="btn btn-primary" to="/tentang">Tentang KADAR</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
