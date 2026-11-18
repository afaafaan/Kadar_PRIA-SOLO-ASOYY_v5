import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { cities as allCities } from '../data/cities.js'
import { aqiColor, band } from '../components/ui.jsx'
import { useScheme } from '../lib/scheme.js'
import s from './Monitor.module.css'

const BOUNDS = allCities.map((c) => [c.lat, c.lng])
// Peta OpenStreetMap seperti v3.2. Di mode gelap, ubin diberi filter lewat CSS (.map.dark).
const TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; OpenStreetMap'

const markerIcon = (city, selected) =>
  L.divIcon({
    className: s.markerSlot,
    html: `<span class="${s.marker}" style="--c: ${aqiColor(city.aqi)}"${selected ? ' data-selected' : ''}>${city.aqi}</span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })

function FollowSelection({ city, markers }) {
  const map = useMap()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const zoom = Math.max(map.getZoom(), 6)
    if (reduce) map.setView([city.lat, city.lng], zoom)
    else map.flyTo([city.lat, city.lng], zoom, { duration: 0.8 })
    markers.current[city.name]?.openPopup()
  }, [city, map, markers])
  return null
}

export default function AirMap({ cities, selected, onSelect }) {
  const dark = useScheme() === 'dark'
  const markers = useRef({})
  return (
    <MapContainer
      className={`${s.map} ${dark ? s.dark : ''}`}
      bounds={BOUNDS}
      boundsOptions={{ padding: [32, 32] }}
      scrollWheelZoom={false}
      attributionControl
    >
      <TileLayer url={TILES} attribution={ATTRIBUTION} />
      {cities.map((c) => (
        <Marker
          key={c.name}
          ref={(m) => { if (m) markers.current[c.name] = m }}
          position={[c.lat, c.lng]}
          icon={markerIcon(c, c.name === selected.name)}
          title={`${c.name}, AQI ${c.aqi}`}
          alt={`${c.name}, AQI ${c.aqi}`}
          zIndexOffset={c.name === selected.name ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(c.name) }}
        >
          <Popup>
            <b>{c.name}</b><br />AQI demo {c.aqi} · {band(c.aqi).label}
          </Popup>
        </Marker>
      ))}
      <FollowSelection city={selected} markers={markers} />
    </MapContainer>
  )
}
