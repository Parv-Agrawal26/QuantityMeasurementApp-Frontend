import React from 'react'
import { UNITS } from '../services/constants'

/**
 * Reusable quantity input group.
 * Props: label, value, measurementType, unit, types, onChange
 *   onChange({ value, measurementType, unit })
 */
export default function QuantityForm({ label, value, measurementType, unit, types, onChange }) {
  const units = measurementType ? (UNITS[measurementType] || []) : []

  return (
    <div className="card h-100">
      <div className="card-body">
        <h6 className="fw-semibold text-muted mb-3">{label}</h6>

        <div className="mb-3">
          <label className="form-label small fw-semibold">Value</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 10"
            value={value}
            onChange={(e) => onChange({ value: e.target.value, measurementType, unit })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label small fw-semibold">Measurement Type</label>
          <select
            className="form-select"
            value={measurementType}
            onChange={(e) => onChange({ value, measurementType: e.target.value, unit: '' })}
          >
            <option value="">Select type…</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="mb-0">
          <label className="form-label small fw-semibold">Unit</label>
          <select
            className="form-select"
            value={unit}
            onChange={(e) => onChange({ value, measurementType, unit: e.target.value })}
            disabled={!measurementType}
          >
            <option value="">Select unit…</option>
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
