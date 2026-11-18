// Mock data carried over unchanged from the prototype (US AQI, µg/m³, °C).
export const cities = [
  { name: 'Jakarta', region: 'DKI Jakarta', lat: -6.2088, lng: 106.8456, aqi: 42, pm25: 8.4, pm10: 18, temp: 30 },
  { name: 'Bandung', region: 'Jawa Barat', lat: -6.9175, lng: 107.6191, aqi: 58, pm25: 12.1, pm10: 24, temp: 25 },
  { name: 'Surabaya', region: 'Jawa Timur', lat: -7.2575, lng: 112.7521, aqi: 76, pm25: 19.6, pm10: 38, temp: 32 },
  { name: 'Semarang', region: 'Jawa Tengah', lat: -6.9667, lng: 110.4167, aqi: 64, pm25: 14.8, pm10: 29, temp: 31 },
  { name: 'Yogyakarta', region: 'DI Yogyakarta', lat: -7.7956, lng: 110.3695, aqi: 35, pm25: 6.9, pm10: 15, temp: 28 },
  { name: 'Medan', region: 'Sumatera Utara', lat: 3.5952, lng: 98.6722, aqi: 112, pm25: 39.4, pm10: 67, temp: 31 },
  { name: 'Makassar', region: 'Sulawesi Selatan', lat: -5.1477, lng: 119.4327, aqi: 49, pm25: 9.2, pm10: 20, temp: 31 },
  { name: 'Denpasar', region: 'Bali', lat: -8.6705, lng: 115.2126, aqi: 28, pm25: 5.1, pm10: 12, temp: 29 },
]

export const findCity = (name) => cities.find((c) => c.name === name) ?? cities[0]
