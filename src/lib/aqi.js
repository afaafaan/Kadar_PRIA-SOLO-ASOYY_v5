// Single source of truth for AQI categories, advice and forecast helpers.
// Categories follow the US EPA AQI, labelled in Indonesian.

export const LEVELS = [
  {
    key: 'good', max: 50, label: 'Baik',
    advice: 'Aman untuk beraktivitas di luar ruangan.',
    detail: 'Kualitas udara memuaskan dan risikonya kecil.',
  },
  {
    key: 'moderate', max: 100, label: 'Sedang',
    advice: 'Sebagian besar orang tetap bisa beraktivitas seperti biasa.',
    detail: 'Orang yang sangat sensitif sebaiknya mengurangi aktivitas berat yang lama di luar ruangan.',
  },
  {
    key: 'usg', max: 150, label: 'Tidak sehat bagi kelompok sensitif',
    advice: 'Kelompok sensitif sebaiknya membatasi aktivitas berat di luar.',
    detail: 'Anak-anak, lansia, serta penderita asma atau penyakit jantung lebih mudah terdampak. Orang lain umumnya masih aman.',
  },
  {
    key: 'unhealthy', max: 200, label: 'Tidak sehat',
    advice: 'Kurangi aktivitas berat di luar ruangan.',
    detail: 'Semua orang bisa mulai merasakan dampaknya. Kelompok sensitif sebaiknya tetap di dalam ruangan.',
  },
  {
    key: 'very', max: 300, label: 'Sangat tidak sehat',
    advice: 'Hindari aktivitas di luar ruangan.',
    detail: 'Risiko kesehatan meningkat untuk semua orang. Tutup jendela dan pakai masker jika harus keluar.',
  },
  {
    key: 'hazardous', max: Infinity, label: 'Berbahaya',
    advice: 'Tetap di dalam ruangan.',
    detail: 'Kondisi darurat kesehatan. Ikuti arahan resmi pemerintah setempat.',
  },
]

export const level = (aqi) => LEVELS.find((l) => aqi <= l.max)

export const rangeOf = (l) => {
  const i = LEVELS.indexOf(l)
  const min = i === 0 ? 0 : LEVELS[i - 1].max + 1
  return l.max === Infinity ? `${min}+` : `${min}–${l.max}`
}

// Per-activity thresholds: [last "ok" AQI, last "caution" AQI]. Above that: avoid.
// Based on EPA activity guidance (heavy exertion and children are the sensitive cases).
export const ACTIVITIES = [
  { id: 'run', name: 'Jogging atau lari', limits: [50, 100] },
  { id: 'bike', name: 'Bersepeda santai', limits: [100, 150] },
  { id: 'kids', name: 'Anak bermain di luar', limits: [50, 100] },
  { id: 'mask', name: 'Masker saat keluar', limits: [100, 150], labels: ['Tidak perlu', 'Untuk kelompok sensitif', 'Disarankan'] },
]
const VERDICTS = ['ok', 'caution', 'avoid']
const VERDICT_LABELS = ['Aman', 'Batasi durasi', 'Tunda dulu']

export function verdict(aqi, activity) {
  const i = aqi <= activity.limits[0] ? 0 : aqi <= activity.limits[1] ? 1 : 2
  return { key: VERDICTS[i], label: (activity.labels ?? VERDICT_LABELS)[i] }
}

// --- Forecast helpers (12 slots of 2 hours) ---
export const slotLabel = (i) => `${String(i * 2).padStart(2, '0')}.00`
export const windowLabel = (i) => `${slotLabel(i)}–${slotLabel(i + 1)}`
export const currentSlot = (date = new Date()) => Math.floor(date.getHours() / 2)

const pick = (values, better) =>
  values.reduce((best, v, i) => (better(v, values[best]) ? i : best), 0)

export const bestSlot = (values) => pick(values, (a, b) => a < b)
export const worstSlot = (values) => pick(values, (a, b) => a > b)
export const average = (values) => Math.round(values.reduce((a, b) => a + b, 0) / values.length)

export function trend(values) {
  const half = values.length / 2
  const am = average(values.slice(0, half))
  const pm = average(values.slice(half))
  if (Math.abs(am - pm) < 5) return 'Stabil sepanjang hari'
  return am < pm ? 'Lebih bersih sebelum tengah hari' : 'Lebih bersih setelah tengah hari'
}

// --- Pollutants: EPA sub-index breakpoints [concLow, concHigh, aqiLow, aqiHigh] ---
const BREAKPOINTS = {
  pm25: [[0, 9, 0, 50], [9.1, 35.4, 51, 100], [35.5, 55.4, 101, 150], [55.5, 125.4, 151, 200], [125.5, 225.4, 201, 300], [225.5, 325.4, 301, 500]],
  pm10: [[0, 54, 0, 50], [55, 154, 51, 100], [155, 254, 101, 150], [255, 354, 151, 200], [355, 424, 201, 300], [425, 604, 301, 500]],
}

export function subIndex(pollutant, conc) {
  const table = BREAKPOINTS[pollutant]
  const [cl, ch, il, ih] = table.find((b) => conc <= b[1]) ?? table.at(-1)
  return Math.round(((ih - il) / (ch - cl)) * (Math.min(conc, ch) - cl) + il)
}

export const dominantPollutant = (city) =>
  subIndex('pm10', city.pm10) > subIndex('pm25', city.pm25) ? 'PM10' : 'PM2.5'

// Nearest city by equirectangular distance; accurate enough at city scale.
export function nearestCity(list, lat, lng) {
  const d = (c) => {
    const x = (c.lng - lng) * Math.cos(((c.lat + lat) / 2) * (Math.PI / 180))
    return x * x + (c.lat - lat) ** 2
  }
  return list.reduce((a, b) => (d(b) < d(a) ? b : a))
}

export const num = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })
