import axios from 'axios'

// Base URL — reads from localStorage so users can change it at runtime via the topbar
const getBaseURL = () => localStorage.getItem('qm_server') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function createClient(token) {
  const client = axios.create({
    baseURL: getBaseURL(),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  return client
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    createClient().post('/api/v1/auth/login', { email, password }),

  register: (email, password) =>
    createClient().post('/api/v1/auth/register', { email, password }),

  logout: (token) =>
    createClient(token).post('/api/v1/auth/logout'),
}

// ── Quantity operations ───────────────────────────────────────────────────────
export const quantityAPI = {
  compare: (payload, token) =>
    createClient(token).post('/api/v1/quantities/compare', payload),

  convert: (payload, token) =>
    createClient(token).post('/api/v1/quantities/convert', payload),

  add: (payload, token) =>
    createClient(token).post('/api/v1/quantities/add', payload),

  subtract: (payload, token) =>
    createClient(token).post('/api/v1/quantities/subtract', payload),

  divide: (payload, token) =>
    createClient(token).post('/api/v1/quantities/divide', payload),
}

// ── History & Statistics (auth required) ─────────────────────────────────────
export const historyAPI = {
  getAll: (token) =>
    createClient(token).get('/api/v1/quantities/history'),

  getByOperation: (operation, token) =>
    createClient(token).get(`/api/v1/quantities/history/${operation}`),

  getCount: (operation, token) =>
    createClient(token).get(`/api/v1/quantities/count/${operation}`),

  getAllCounts: (token) =>
    Promise.all(
      ['COMPARE', 'CONVERT', 'ADD', 'SUBTRACT', 'DIVIDE'].map((op) =>
        createClient(token)
          .get(`/api/v1/quantities/count/${op}`)
          .then((r) => ({ op, count: r.data ?? 0 }))
          .catch(() => ({ op, count: 0 }))
      )
    ),
}

// ── Helpers ──────────────────────────────────────────────────────────────────
export function buildQuantityPayload(thisQ, thatQ) {
  return {
    thisQuantityDTO: thisQ,
    thatQuantityDTO: thatQ,
  }
}
