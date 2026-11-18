import { useId } from 'react'
import { Link } from 'react-router'
import { Eyebrow, Reveal } from '../components/ui.jsx'
import { useToast } from '../lib/toast.jsx'
import s from './Content.module.css'

const VALUES = [
  ['CHECK', 'Cek udara'],
  ['UNDERSTAND', 'Pahami'],
  ['PROTECT', 'Lindungi diri'],
]

export default function About() {
  const toast = useToast()

  function submit(e) {
    e.preventDefault()
    e.currentTarget.reset()
    toast('Pesan terkirim. Ini versi demo, jadi pesan tidak benar-benar dikirim.')
  }

  return (
    <div className="container page">
      <title>About — KADAR Kabar Udara</title>

      <Reveal className={s.aboutGrid}>
        <div>
          <div className={s.crumb}><Link to="/">Home</Link> / About</div>
          <Eyebrow>TENTANG KADAR</Eyebrow>
          <h1 tabIndex={-1}>Karena udara<br />adalah <em>cerita kita.</em></h1>
        </div>
        <div className={s.aboutCopy}>
          <p>
            KADAR (Kabar Udara) adalah ruang informasi yang membantu masyarakat mengenali kualitas
            udara di berbagai kota, memahami artinya, dan memilih tindakan yang tepat.
          </p>
          <p>
            Melalui pemantauan, prediksi, kabar, dan edukasi, KADAR mengajak setiap orang mengambil
            langkah kecil demi lingkungan yang lebih sehat.
          </p>
          <ul className={s.aboutValues}>
            {VALUES.map(([word, label]) => (
              <li key={word}><b>{word}</b> {label}</li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal as="section" className={s.contactCard} id="kontak" aria-labelledby="judul-kontak">
        <div>
          <h2 id="judul-kontak">Punya masukan<br />untuk <em>KADAR?</em></h2>
          <p>Kirim saran, pertanyaan, atau laporan kendala.</p>
          <div className={s.contactLinks}>
            <a href="mailto:halo@kadarudara.demo">
              <span>EMAIL (DEMO)</span>
              <b>halo@kadarudara.demo ↗</b>
            </a>
          </div>
        </div>

        <form className={s.form} onSubmit={submit}>
          <Field label="Nama" name="nama" autoComplete="name" error="Isi namamu." />
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            hint="Contoh: nama@email.com"
            error="Masukkan email dengan format nama@email.com."
          />
          <Field label="Pesan" name="pesan" placeholder="Pesan atau aduan" multiline error="Tulis pesanmu sebelum mengirim." />
          <button className="btn btn-primary">Kirim pesan</button>
        </form>
      </Reveal>
    </div>
  )
}

// Pesan galat baru muncul setelah pengguna berinteraksi (:user-invalid); aria-invalid dan tautan galat mengikutinya.
// Label tetap ada untuk pembaca layar; secara visual diganti placeholder seperti di v3.2.
function Field({ label, name, hint, error, multiline, ...props }) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : null
  const errorId = `${id}-error`

  function sync(e) {
    const el = e.currentTarget
    const invalid = el.matches(':user-invalid')
    el.setAttribute('aria-invalid', String(invalid))
    el.setAttribute('aria-describedby', [hintId, invalid && errorId].filter(Boolean).join(' '))
  }

  const Control = multiline ? 'textarea' : 'input'
  return (
    <div className={s.field}>
      <label htmlFor={id} className="sr-only">{label}</label>
      {hint && <span id={hintId} className="sr-only">{hint}</span>}
      <Control
        id={id}
        name={name}
        required
        placeholder={label}
        rows={multiline ? 4 : undefined}
        aria-invalid="false"
        aria-describedby={hintId ?? undefined}
        onBlur={sync}
        onInput={sync}
        onInvalid={sync}
        {...props}
      />
      <span id={errorId} className={s.error}>{error}</span>
    </div>
  )
}
