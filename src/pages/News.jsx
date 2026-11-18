import { useEffect, useRef, useState } from 'react'
import { news } from '../data/news.js'
import { Chips, PageHeader } from '../components/ui.jsx'
import s from './Content.module.css'

const CATEGORIES = ['Semua', ...new Set(news.map((n) => n.category))].map((c) => [c, c])

export default function News() {
  const [category, setCategory] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const first = useRef(true)
  const items = news.filter((n) => category === 'Semua' || n.category === category)

  // Skeleton shimmer sebentar saat halaman dibuka dan saat filter diganti.
  useEffect(() => {
    setLoading(true)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const wait = reduce ? 0 : first.current ? 800 : 450
    first.current = false
    const t = setTimeout(() => setLoading(false), wait)
    return () => clearTimeout(t)
  }, [category])

  return (
    <div className="container page">
      <title>News — KADAR Kabar Udara</title>
      <PageHeader crumb="News" title={<>Kabar terbaru untuk<br /><em>bumi yang lebih sehat.</em></>}>
        Isu udara dan lingkungan dengan tautan ke sumber yang dapat ditelusuri.
      </PageHeader>

      <div className={s.chipRow}>
        <Chips label="Saring menurut topik" options={CATEGORIES} value={category} onChange={setCategory} />
      </div>

      <div className={s.newsGrid} aria-busy={loading}>
        {loading
          ? Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={s.skCard} aria-hidden="true">
                <div className={s.sk} />
                <div className={s.sk} />
                <div className={s.sk} style={{ width: '70%' }} />
              </div>
            ))
          : items.map((n, i) => (
              <article
                key={n.title}
                className={`${s.newsCard} ${i === 0 && category === 'Semua' ? s.newsFeature : ''}`}
              >
                <div className={`${s.newsArt} ${s[`art-${n.art}`]}`} aria-hidden="true">
                  <b>{n.banner[0]}<br />{n.banner[1]}</b>
                </div>
                <div className={s.newsBody}>
                  <div className={s.newsMeta}>
                    <span>{n.category.toUpperCase()}</span>
                    <span>• {n.minutes} MENIT BACA</span>
                  </div>
                  <h2>{n.title}</h2>
                  <p>{n.summary}</p>
                  <a href={n.url} target="_blank" rel="noopener">
                    Baca dari {n.source} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (membuka tab baru)</span>
                  </a>
                </div>
              </article>
            ))}
      </div>

      <p className={s.note}>
        Konten editorial demo yang mengarah ke referensi lembaga, bukan feed real-time. Ganti
        ilustrasi dengan foto berita berlisensi sebelum final.
      </p>
    </div>
  )
}
