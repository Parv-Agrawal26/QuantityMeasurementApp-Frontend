import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { quantityAPI, buildQuantityPayload } from '../services/api'
import { ARITHMETIC_TYPES } from '../services/constants'
import QuantityForm from '../components/QuantityForm'
import { ArithmeticResult } from '../components/ResultCard'
import PageHeader from '../components/PageHeader'

const OPERATIONS = [
  { key: 'add',      label: 'Add',      icon: 'bi-plus-circle',  variant: 'success'   },
  { key: 'subtract', label: 'Subtract', icon: 'bi-dash-circle',  variant: 'warning'   },
  { key: 'divide',   label: 'Divide',   icon: 'bi-slash-circle', variant: 'secondary' },
]

const EMPTY = { value: '', measurementType: '', unit: '' }

export default function ArithmeticPage() {
  const { token } = useAuth()
  const [currentOp, setCurrentOp] = useState('add')
  const [qA, setQA] = useState(EMPTY)
  const [qB, setQB] = useState(EMPTY)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    if (!qA.value || !qA.unit || !qB.value || !qB.unit) {
      toast.warning('Please fill in all fields for both quantities.')
      return
    }
    if (qA.measurementType !== qB.measurementType) {
      toast.error('Both quantities must have the same measurement type.')
      return
    }
    setLoading(true)
    try {
      const payload = buildQuantityPayload(
        { value: +qA.value, unit: qA.unit, measurementType: qA.measurementType },
        { value: +qB.value, unit: qB.unit, measurementType: qB.measurementType }
      )
      const res = await quantityAPI[currentOp](payload, token)
      setResult(res.data)
      if (!res.data.error) toast.success('Calculation complete!')
    } catch (err) {
      toast.error('Could not reach the server.')
      setResult({ error: true, errorMessage: 'Could not reach the server.' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setQA(EMPTY)
    setQB(EMPTY)
    setResult(null)
  }

  return (
    <>
      <PageHeader
        title="Arithmetic Operations"
        subtitle="Add, subtract, or divide two quantities of the same measurement type"
        icon="bi-calculator"
      />

      {/* Operation selector */}
      <div className="card mb-3">
        <div className="card-body">
          <label className="form-label small fw-semibold d-block mb-2">Select Operation</label>
          <div className="d-flex gap-2 flex-wrap">
            {OPERATIONS.map((op) => (
              <button
                key={op.key}
                className={`btn op-btn ${currentOp === op.key ? `btn-${op.variant}` : `btn-outline-${op.variant}`}`}
                onClick={() => { setCurrentOp(op.key); setResult(null) }}
              >
                <i className={`bi ${op.icon} me-2`} />
                {op.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quantity inputs */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <QuantityForm
            label="Quantity A"
            {...qA}
            types={ARITHMETIC_TYPES}
            onChange={setQA}
          />
        </div>
        <div className="col-md-6">
          <QuantityForm
            label="Quantity B"
            {...qB}
            types={ARITHMETIC_TYPES}
            onChange={setQB}
          />
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button
          className="btn btn-primary px-4"
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading
            ? <><span className="spinner-border spinner-border-sm me-2" />Calculating…</>
            : <><i className="bi bi-calculator me-2" />Calculate</>}
        </button>
        <button className="btn btn-outline-secondary" onClick={handleReset}>
          <i className="bi bi-arrow-counterclockwise me-1" />Reset
        </button>
      </div>

      {result ? (
        <ArithmeticResult data={result} op={currentOp} />
      ) : (
        <div className="text-muted small fst-italic">
          Select an operation, fill both quantities and click Calculate.
        </div>
      )}
    </>
  )
}
