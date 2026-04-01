import React from 'react'

function MetaBox({ label, value }) {
  return (
    <div className="meta-box">
      <div className="meta-key">{label}</div>
      <div className="meta-val">{value ?? '—'}</div>
    </div>
  )
}

function fmt(v) {
  return v != null ? +parseFloat(v).toFixed(6) : '—'
}

export function CompareResult({ data }) {
  if (!data) return null
  if (data.error) {
    return (
      <div className="result-error">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        <strong>Error:</strong> {data.errorMessage || 'Unknown error'}
      </div>
    )
  }
  const isEqual = data.resultString === 'true'
  return (
    <div className="result-success">
      <div className="result-label">Comparison Result</div>
      <div className={`result-value ${isEqual ? 'text-success' : 'text-danger'}`}>
        {isEqual ? '✓ EQUAL' : '✗ NOT EQUAL'}
      </div>
      <div className="meta-grid">
        <MetaBox label="Qty A" value={`${data.thisValue} ${data.thisUnit}`} />
        <MetaBox label="Qty B" value={`${data.thatValue} ${data.thatUnit}`} />
        <MetaBox label="Type" value={data.thisMeasurementType} />
        <MetaBox label="Record #" value={data.id} />
      </div>
    </div>
  )
}

export function ConvertResult({ data }) {
  if (!data) return null
  if (data.error) {
    return (
      <div className="result-error">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        <strong>Error:</strong> {data.errorMessage || 'Unknown error'}
      </div>
    )
  }
  return (
    <div className="result-success">
      <div className="result-label">Conversion Result</div>
      <div className="result-value">{fmt(data.resultValue)} {data.resultUnit}</div>
      <div className="meta-grid">
        <MetaBox label="Original" value={`${data.thisValue} ${data.thisUnit}`} />
        <MetaBox label="Converted" value={`${fmt(data.resultValue)} ${data.resultUnit}`} />
        <MetaBox label="Type" value={data.thisMeasurementType} />
        <MetaBox label="Record #" value={data.id} />
      </div>
    </div>
  )
}

export function ArithmeticResult({ data, op }) {
  if (!data) return null
  const labels = { add: 'Addition', subtract: 'Subtraction', divide: 'Division' }
  if (data.error) {
    return (
      <div className="result-error">
        <i className="bi bi-exclamation-triangle-fill me-2" />
        <strong>Error:</strong> {data.errorMessage || 'Unknown error'}
      </div>
    )
  }
  return (
    <div className="result-success">
      <div className="result-label">{labels[op] || op} Result</div>
      <div className="result-value">{fmt(data.resultValue)} {data.resultUnit || ''}</div>
      <div className="meta-grid">
        <MetaBox label="Qty A" value={`${data.thisValue} ${data.thisUnit}`} />
        <MetaBox label="Qty B" value={`${data.thatValue} ${data.thatUnit}`} />
        <MetaBox label="Operation" value={labels[op] || op} />
        <MetaBox label="Record #" value={data.id} />
      </div>
    </div>
  )
}
