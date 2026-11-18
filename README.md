<h1 align="center">KABAR UDARA</h1>

<p align="justify">
  Kadar atau yang kami sebut kabar udara merupakan Inovasi yang dibuat untuk memberikan kemudahan bagi user dalam memantau kondisi udara di sekitar mereka. Dengan beberapa fitur yang kami adopsi dari pemantau cuaca yang ada seperti pada umumnya, kadar lahir dari permasalahan yang ada saat ini. Melihat kondisi udara yang memburuk di sekitar kita seperti gas karbon monoksida, nitrogen oksida, sulfur dioksida, dan masih banyak lagi gas gas yang dikeluarkan dari fenomena kebakaran hutan, pembakaran bahan bakar fosil, pengelolaan sampah dan limbah, dll. 
</p>

## Fitur Utama
- Indeks Kualitas Udara Real-Time
- Rekomendasi Kesehatan & Aktivitas
- Kabar terbaru seputar permasalahan udara saat ini
- Peta interaktif
- Grafik Tren Historis
- Prakiraan Kualitas Udara
- Peringkat Wilayah (Leaderboard)
- Peringatan Dini (Threshold Alert)
- Informasi Edukasi & Skala AQI

## Teknologi yang Digunakan
- Node.js
- leaflet.js
- chart.js
- app.js


```sh
npm install
npm run dev      # http://localhost:5173
npm test         # AQI logic checks (node:test)
npm run build    # static output in dist/
```

Single-page app: when deploying, rewrite every path to `index.html` (the static SPA defaults on Vercel and Netlify do this).

```
src/
  data/        cities, forecast, news (mock data)
  lib/aqi.js   AQI categories, advice, activity thresholds, forecast helpers (single source of truth)
  lib/         colour-scheme override, toast
  styles/      design tokens (type, space, colour incl. AQI scale) + base
  components/  Layout (nav, footer), Logo, Intro, shared UI
  pages/       one file per route; Monitor (with Leaflet) and the others load on demand
```

## Tampilan (UI/UX v3.2)

Tampilan mengikuti prototipe KADAR v3.2; struktur project, routing, data, dan logika AQI tidak berubah.

- Font DM Sans + Manrope dimuat dari Google Fonts (`index.html`), bukan lagi paket `@fontsource`.
- Aset logo dan GIF intro ada di `public/assets/`.
- Navbar pill liquid glass, chip jam, dan tombol tema ada di `components/Layout.jsx`; intro 2 tahap di `components/Intro.jsx`.
- Komponen bersama (judul bagian, chip, kartu saran, efek `Reveal`) ada di `components/ui.jsx`.
