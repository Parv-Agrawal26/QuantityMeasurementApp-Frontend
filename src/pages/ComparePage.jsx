import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { quantityAPI, buildQuantityPayload } from '../services/api'
import { MEASUREMENT_TYPES } from '../services/constants'
import QuantityForm from '../components/QuantityForm'
import { CompareResult } from '../components/ResultCard'
import PageHeader from '../components/PageHeader'

const EMPTY = { value: '', measurementType: '', unit: '' }

export default function ComparePage() {
  const { token } = useAuth()
  const [qA, setQA] = useState(EMPTY)
  const [qB, setQB] = useState(EMPTY)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCompare = async () => {
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
      const res = await quantityAPI.compare(payload, token)
      setResult(res.data)
      if (!res.data.error) toast.success('Comparison complete!')
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
        title="Compare Quantities"
        subtitle="Check whether two quantities are equal when converted to the same base unit"
        icon="bi-arrow-left-right"
      />

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <QuantityForm
            label="Quantity A"
            {...qA}
            types={MEASUREMENT_TYPES}
            onChange={setQA}
          />
        </div>
        <div className="col-md-6">
          <QuantityForm
            label="Quantity B"
            {...qB}
            types={MEASUREMENT_TYPES}
            onChange={setQB}
          />
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button
          className="btn btn-primary px-4"
          onClick={handleCompare}
          disabled={loading}
        >
          {loading
            ? <><span className="spinner-border spinner-border-sm me-2" />Comparing…</>
            : <><i className="bi bi-arrow-left-right me-2" />Compare</>}
        </button>
        <button className="btn btn-outline-secondary" onClick={handleReset}>
          <i className="bi bi-arrow-counterclockwise me-1" />Reset
        </button>
      </div>

      {result ? (
        <CompareResult data={result} />
      ) : (
        <div className="text-muted small fst-italic">
          Fill both quantities and click Compare.
        </div>
      )}
    </>
  )
}
