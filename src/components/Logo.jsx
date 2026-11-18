import s from './Logo.module.css'

// Logo KADAR: gambar dari assets v3.2 (public/assets/kadar-logo.png).
export default function Logo({ className = '' }) {
  return (
    <img
      className={`${s.logo} ${className}`}
      src="/assets/kadar-logo.png"
      alt="KADAR, Kabar Udara"
      width="1293"
      height="300"
    />
  )
}
