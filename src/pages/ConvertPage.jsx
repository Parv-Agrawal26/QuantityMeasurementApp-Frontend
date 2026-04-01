import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { quantityAPI, buildQuantityPayload } from '../services/api'
import { MEASUREMENT_TYPES, UNITS } from '../services/constants'
import { ConvertResult } from '../components/ResultCard'
import PageHeader from '../components/PageHeader'

export default function ConvertPage() {
  const { token } = useAuth()
  const [measurementType, setMeasurementType] = useState('')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const units = measurementType ? UNITS[measurementType] || [] : []

  const handleTypeChange = (e) => {
    setMeasurementType(e.target.value)
    setFromUnit('')
    setToUnit('')
    setResult(null)
  }

  const handleConvert = async () => {
    if (!measurementType || !fromUnit || !toUnit || !value) {
      toast.warning('Please fill in all fields.')
      return
    }
    if (fromUnit === toUnit) {
      toast.info('From and To units are the same — no conversion needed.')
      return
    }
    setLoading(true)
    try {
      const payload = buildQuantityPayload(
        { value: +value, unit: fromUnit, measurementType },
        { value: 0, unit: toUnit, measurementType }
      )
      const res = await quantityAPI.convert(payload, token)
      setResult(res.data)
      if (!res.data.error) toast.success('Conversion complete!')
    } catch (err) {
      toast.error('Could not reach the server.')
      setResult({ error: true, errorMessage: 'Could not reach the server.' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMeasurementType('')
    setFromUnit('')
    setToUnit('')
    setValue('')
    setResult(null)
  }

  return (
    <>
      <PageHeader
        title="Convert Units"
        subtitle="Convert a value from one unit to another within the same measurement type"
        icon="bi-arrow-repeat"
      />

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Measurement Type</label>
              <select className="form-select" value={measurementType} onChange={handleTypeChange}>
                <option value="">Select type…</option>
                {MEASUREMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">From Unit</label>
              <select
                className="form-select"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                disabled={!measurementType}
              >
                <option value="">Select unit…</option>
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">To Unit</label>
              <select
                className="form-select"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                disabled={!measurementType}
              >
                <option value="">Select unit…</option>
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <hr />

          <div className="col-md-4">
            <label className="form-label small fw-semibold">Value to Convert</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 100"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button
          className="btn btn-primary px-4"
          onClick={handleConvert}
          disabled={loading}
        >
          {loading
            ? <><span className="spinner-border spinner-border-sm me-2" />Converting…</>
            : <><i className="bi bi-arrow-repeat me-2" />Convert</>}
        </button>
        <button className="btn btn-outline-secondary" onClick={handleReset}>
          <i className="bi bi-arrow-counterclockwise me-1" />Reset
        </button>
      </div>

      {result ? (
        <ConvertResult data={result} />
      ) : (
        <div className="text-muted small fst-italic">
          Select type, units and enter a value to convert.
        </div>
      )}
    </>
  )
}
