import { useCallback, useEffect, useRef, useState, ViewTransition } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router'
import { ArrowUp, Menu, Moon, Sun } from 'lucide-react'
import Logo from './Logo.jsx'
import Intro from './Intro.jsx'
import { toggleScheme, useScheme } from '../lib/scheme.js'
import s from './Layout.module.css'

export const NAV = [
  ['/', 'Home'],
  ['/pantau', 'Air Monitor'],
  ['/prakiraan', 'Air Forecast'],
  ['/berita', 'News'],
  ['/edukasi', 'Education'],
  ['/tentang', 'About'],
]

export default function Layout() {
  const { pathname } = useLocation()
  const menu = useRef(null)
  const firstRender = useRef(true)
  const [intro, setIntro] = useState(() => 'intro' in document.documentElement.dataset)
  const endIntro = useCallback(() => {
    delete document.documentElement.dataset.intro
    setIntro(false)
  }, [])

  // Setelah pindah halaman: tutup menu mobile dan pindahkan fokus ke judul halaman baru.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (menu.current?.matches(':popover-open')) menu.current.hidePopover()
    document.querySelector('main h1')?.focus({ preventScroll: true })
  }, [pathname])

  // Efek ripple pada semua tombol utama (.btn-primary).
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onClick = (e) => {
      const btn = e.target.closest?.('.btn-primary')
      if (!btn) return
      const r = btn.getBoundingClientRect()
      const ripple = document.createElement('i')
      ripple.className = 'rip'
      ripple.setAttribute('aria-hidden', 'true')
      ripple.style.cssText = `width:40px;height:40px;left:${e.clientX - r.left - 20}px;top:${e.clientY - r.top - 20}px`
      btn.appendChild(ripple)
      setTimeout(() => ripple.remove(), 600)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <a className={s.skip} href="#konten">Langsung ke konten</a>
      <Header menu={menu} />

      <ViewTransition>
        <main id="konten">
          <Outlet />
        </main>
      </ViewTransition>

      <Footer />
      {!intro && <ClockChip />}
      <BackTop />
      <ScrollRestoration />
      {intro && <Intro onDone={endIntro} />}
    </>
  )
}

function Header({ menu }) {
  const scheme = useScheme()
  const dark = scheme === 'dark'
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <Link to="/" className={s.brand} aria-label="KADAR, ke beranda">
          <Logo />
        </Link>

        <nav aria-label="Utama" className={s.nav}>
          <button type="button" className={s.menuButton} popoverTarget="menu-utama" aria-controls="menu-utama">
            <Menu size={20} aria-hidden="true" />
            <span className="sr-only">Menu</span>
          </button>
          <ul id="menu-utama" ref={menu} popover="auto" className={s.menu}>
            {NAV.map(([to, label]) => (
              <li key={to}>
                <NavLink to={to} end={to === '/'} className={s.link}>{label}</NavLink>
              </li>
            ))}
            <li className={s.menuContact}>
              <Link to="/tentang#kontak" className={s.link}>Hubungi kami <span aria-hidden="true">↗</span></Link>
            </li>
          </ul>
        </nav>

        <div className={s.actions}>
          <button
            type="button"
            className={s.themeToggle}
            onClick={toggleScheme}
            aria-label={dark ? 'Ganti ke tampilan terang' : 'Ganti ke tampilan gelap'}
          >
            {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <Link to="/tentang#kontak" className={s.contact}>
            Hubungi kami <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.footerMain}>
          <Link to="/" className={s.footerBrand} aria-label="KADAR, ke beranda">
            <Logo className={s.footerLogo} />
            <span>Informasi udara untuk keputusan yang lebih baik.</span>
          </Link>

          <nav aria-label="Halaman" className={s.footerNav}>
            {NAV.slice(1).map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          </nav>

          <div className={s.footerSocial}>
            <span>IKUTI KADAR (DEMO)</span>
            <a href="https://instagram.com/" target="_blank" rel="noopener">Instagram @kadar.udara ↗</a>
            <a href="https://tiktok.com/" target="_blank" rel="noopener">TikTok @kabarudara ↗</a>
            <a href="mailto:halo@kadarudara.demo">halo@kadarudara.demo ↗</a>
          </div>
        </div>

        <div className={s.footerBottom}>
          <span>© 2026 KADAR — Kabar Udara. Prototype lomba web design.</span>
        </div>
        <p className={s.disclaimer}>
          Seluruh angka AQI, polutan, suhu, kota, dan grafik adalah data dummy/simulasi, bukan
          pengukuran aktual dan bukan dasar diagnosis medis.
        </p>
      </div>
    </footer>
  )
}

// Tanggal dan jam lokal perangkat, melayang di pojok kiri bawah, diperbarui tiap detik.
function ClockChip() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = (opts) => new Intl.DateTimeFormat('id-ID', opts).format(now)
  const zone = new Intl.DateTimeFormat('id-ID', { timeZoneName: 'short' })
    .formatToParts(now)
    .find((p) => p.type === 'timeZoneName')?.value

  return (
    <div className={s.clock} role="group" aria-label="Tanggal dan waktu lokal">
      <span className="live-dot" aria-hidden="true" />
      <div>
        <strong className="num">{fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</strong>
        <small>{fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {zone}</small>
      </div>
    </div>
  )
}

function BackTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(scrollY > 500)
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      type="button"
      className={`${s.backTop} ${show ? s.show : ''}`}
      aria-label="Ke atas"
      tabIndex={show ? 0 : -1}
      onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  )
}
