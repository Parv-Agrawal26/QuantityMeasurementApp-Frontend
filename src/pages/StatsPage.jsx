import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { historyAPI } from '../services/api'
import { OPERATIONS, OP_COLORS } from '../services/constants'
import PageHeader from '../components/PageHeader'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'

// Bootstrap colour hex values to match OP_COLORS
const COLOR_MAP = {
  primary:   '#4f46e5',
  info:      '#0dcaf0',
  success:   '#198754',
  warning:   '#ffc107',
  secondary: '#6c757d',
}

const BAR_COLORS = OPERATIONS.map((op) => COLOR_MAP[OP_COLORS[op]] || '#4f46e5')

export default function StatsPage() {
  const { token } = useAuth()
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(false)

  const loadStats = useCallback(async () => {
    setLoading(true)
    try {
      const results = await historyAPI.getAllCounts(token)
      const map = {}
      results.forEach(({ op, count }) => { map[op] = count })
      setCounts(map)
    } catch (err) {
      toast.error('Failed to load statistics.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const total = OPERATIONS.reduce((s, op) => s + (counts[op] || 0), 0)

  const chartData = OPERATIONS.map((op) => ({
    name: op.charAt(0) + op.slice(1).toLowerCase(),
    count: counts[op] || 0,
  }))

  return (
    <>
      <PageHeader
        title="Statistics"
        subtitle="Successful operation counts by type"
        icon="bi-bar-chart-fill"
      />

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-sm btn-primary"
          onClick={loadStats}
          disabled={loading}
        >
          {loading
            ? <><span className="spinner-border spinner-border-sm me-1" />Loading…</>
            : <><i className="bi bi-arrow-clockwise me-1" />Refresh</>}
        </button>
      </div>

      {/* Stat boxes */}
      <div className="row g-3 mb-4">
        {OPERATIONS.map((op, i) => (
          <div key={op} className="col-6 col-md-4 col-lg-2">
            <div className="stat-box" style={{ borderTopColor: BAR_COLORS[i] }}>
              <div className="stat-label">{op}</div>
              <div className="stat-num" style={{ color: BAR_COLORS[i] }}>
                {loading ? <span className="spinner-border spinner-border-sm" /> : (counts[op] || 0)}
              </div>
              <div className="stat-sub">
                {total > 0 ? Math.round(((counts[op] || 0) / total) * 100) : 0}% of total
              </div>
            </div>
          </div>
        ))}
        <div className="col-6 col-md-4 col-lg-2">
          <div className="stat-box" style={{ borderTopColor: '#1e1b4b' }}>
            <div className="stat-label">TOTAL</div>
            <div className="stat-num" style={{ color: '#1e1b4b' }}>
              {loading ? <span className="spinner-border spinner-border-sm" /> : total}
            </div>
            <div className="stat-sub">All successful ops</div>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">
            <i className="bi bi-bar-chart me-2 text-primary" />
            Operation Distribution
          </h6>
          {loading ? (
            <div className="full-spinner">
              <span className="spinner-border text-primary" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: 'rgba(79,70,229,0.06)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i]} />
                  ))}
                  <LabelList
                    dataKey="count"
                    position="top"
                    style={{ fontSize: 12, fontWeight: 600, fill: '#374151' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  )
}
