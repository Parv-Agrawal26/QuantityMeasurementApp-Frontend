import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { historyAPI } from '../services/api'
import { OPERATIONS, OP_COLORS } from '../services/constants'
import PageHeader from '../components/PageHeader'

function fmt(v) {
  return v != null ? +parseFloat(v).toFixed(6) : '—'
}

export default function HistoryPage() {
  const { token } = useAuth()
  const [rows, setRows] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)

  const loadHistory = useCallback(async () => {
    setLoading(true)
    try {
      const res = filter
        ? await historyAPI.getByOperation(filter, token)
        : await historyAPI.getAll(token)
      setRows(res.data)
    } catch (err) {
      toast.error('Failed to load history.')
    } finally {
      setLoading(false)
    }
  }, [filter, token])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const renderResult = (row) => {
    if (row.error) {
      return <span className="text-danger small">{row.errorMessage || 'Error'}</span>
    }
    if (row.operation === 'COMPARE') {
      const eq = row.resultString === 'true'
      return (
        <span className={`fw-semibold ${eq ? 'text-success' : 'text-danger'}`}>
          {eq ? '✓ Equal' : '✗ Not Equal'}
        </span>
      )
    }
    return <span className="fw-semibold">{fmt(row.resultValue)} {row.resultUnit || ''}</span>
  }

  return (
    <>
      <PageHeader
        title="Operation History"
        subtitle="All operations saved to the database"
        icon="bi-clock-history"
      />

      {/* Filter + refresh bar */}
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 180 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Operations</option>
          {OPERATIONS.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
        <button
          className="btn btn-sm btn-primary"
          onClick={loadHistory}
          disabled={loading}
        >
          {loading
            ? <><span className="spinner-border spinner-border-sm me-1" />Loading…</>
            : <><i className="bi bi-arrow-clockwise me-1" />Refresh</>}
        </button>
        {rows.length > 0 && (
          <span className="badge bg-secondary ms-1">{rows.length} record{rows.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 hist-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Operation</th>
                  <th>Qty A</th>
                  <th>Qty B</th>
                  <th>Result</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      <span className="spinner-border spinner-border-sm me-2" />Loading…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      <i className="bi bi-inbox me-2" />No records found
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id}>
                      <td className="text-muted small">{row.id}</td>
                      <td>
                        <span className={`badge badge-op bg-${OP_COLORS[row.operation] || 'secondary'}`}>
                          {row.operation || '—'}
                        </span>
                      </td>
                      <td className="small">
                        {row.thisValue != null ? `${row.thisValue} ${row.thisUnit}` : '—'}
                      </td>
                      <td className="small">
                        {row.thatValue != null ? `${row.thatValue} ${row.thatUnit}` : '—'}
                      </td>
                      <td>{renderResult(row)}</td>
                      <td>
                        {row.error
                          ? <span className="badge bg-danger">Error</span>
                          : <span className="badge bg-success">OK</span>}
                      </td>
                      <td className="text-muted small">
                        {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
