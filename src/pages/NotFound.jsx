import { Link } from 'react-router'
import { PageHeader } from '../components/ui.jsx'

export default function NotFound() {
  return (
    <div className="container page">
      <title>Halaman tidak ditemukan — KADAR Kabar Udara</title>
      <PageHeader crumb="404" title={<>Halaman<br /><em>tidak ditemukan.</em></>}>
        Alamat ini tidak ada di KADAR. Periksa ejaannya, atau mulai lagi dari beranda.
      </PageHeader>
      <Link className="btn btn-primary" to="/">Ke beranda</Link>
    </div>
  )
}
