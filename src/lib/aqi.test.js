import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  level, rangeOf, LEVELS, ACTIVITIES, verdict, bestSlot, worstSlot, windowLabel,
  trend, subIndex, dominantPollutant, nearestCity,
} from './aqi.js'
import { cities } from '../data/cities.js'
import { hourly } from '../data/forecast.js'

test('category boundaries', () => {
  assert.equal(level(50).key, 'good')
  assert.equal(level(51).key, 'moderate')
  assert.equal(level(112).key, 'usg') // Medan: sensitive groups, not "unhealthy"
  assert.equal(level(301).key, 'hazardous')
  assert.equal(rangeOf(LEVELS[1]), '51–100')
  assert.equal(rangeOf(LEVELS.at(-1)), '301+')
})

test('activity verdicts use real thresholds, not offsets', () => {
  const [run, bike, , mask] = ACTIVITIES
  assert.equal(verdict(42, run).key, 'ok')
  assert.equal(verdict(76, run).key, 'caution')
  assert.equal(verdict(76, bike).key, 'ok')
  assert.equal(verdict(112, run).key, 'avoid')
  assert.equal(verdict(42, mask).label, 'Tidak perlu')
})

test('forecast windows are 2 hours wide', () => {
  const v = hourly.Jakarta
  assert.equal(windowLabel(bestSlot(v)), '04.00–06.00')
  assert.equal(windowLabel(worstSlot(v)), '16.00–18.00')
  assert.equal(windowLabel(11), '22.00–24.00')
  assert.equal(trend(v), 'Lebih bersih sebelum tengah hari')
})

test('pollutant sub-index and dominant pollutant', () => {
  assert.equal(subIndex('pm25', 9), 50)
  assert.equal(subIndex('pm25', 35.4), 100)
  assert.equal(subIndex('pm10', 54), 50)
  assert.equal(dominantPollutant(cities[0]), 'PM2.5')
  assert.equal(dominantPollutant({ pm25: 1, pm10: 150 }), 'PM10')
})

test('nearest city', () => {
  assert.equal(nearestCity(cities, -6.6, 106.8).name, 'Jakarta') // Bogor
  assert.equal(nearestCity(cities, -7.56, 110.82).name, 'Yogyakarta') // Solo
})
