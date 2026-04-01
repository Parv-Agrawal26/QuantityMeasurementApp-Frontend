import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { toast } from 'react-toastify'

const NAV_ITEMS = [
  { to: '/compare',    label: 'Compare',    icon: 'bi-arrow-left-right', section: 'Operations' },
  { to: '/convert',    label: 'Convert',    icon: 'bi-arrow-repeat',     section: null },
  { to: '/arithmetic', label: 'Arithmetic', icon: 'bi-calculator',       section: null },
  { to: '/history',    label: 'History',    icon: 'bi-clock-history',    section: 'Data', protected: true },
  { to: '/stats',      label: 'Statistics', icon: 'bi-bar-chart-fill',   section: null,   protected: true },
]

export default function AppLayout() {
  const { token, email, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [serverUrl, setServerUrl] = useState(
    () => localStorage.getItem('qm_server') || 'http://localhost:8080'
  )

  const handleServerChange = (e) => {
    const val = e.target.value.replace(/\/$/, '')
    setServerUrl(val)
    localStorage.setItem('qm_server', val)
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout(token)
    } catch (_) {}
    logout()
    toast.info('Logged out successfully.')
    navigate('/compare')
  }

  let lastSection = null

  return (
    <div className="app-wrapper">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 1039 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          ⚖️ QM App
        </div>

        <div className="mt-2">
          {NAV_ITEMS.map((item) => {
            const showSection = item.section && item.section !== lastSection
            if (item.section) lastSection = item.section

            return (
              <React.Fragment key={item.to}>
                {showSection && (
                  <div className="sidebar-section d-flex align-items-center gap-1">
                    {item.section}
                    {item.protected && (
                      <span className="ms-1" title="Login required">
                        <i className="bi bi-lock-fill" style={{ fontSize: '0.65rem' }} />
                      </span>
                    )}
                  </div>
                )}
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`bi ${item.icon}`} />
                  {item.label}
                </NavLink>
              </React.Fragment>
            )
          })}
        </div>

        {/* Sidebar footer */}
        <div className="sidebar-footer">
          {isLoggedIn ? (
            <>
              <div className="sidebar-user-email">
                <i className="bi bi-person-circle me-1" />
                {email}
              </div>
              <button
                className="btn btn-outline-light btn-sm w-100"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="sidebar-user-email text-muted">
                <i className="bi bi-person-circle me-1" />
                Guest
              </div>
              <button
                className="btn btn-light btn-sm w-100"
                onClick={() => navigate('/auth')}
              >
                <i className="bi bi-box-arrow-in-right me-1" />
                Sign In
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Main area ── */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-outline-secondary d-md-none"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-list" />
            </button>
            <span className="topbar-title" id="topbar-page-title">Quantity Measurement</span>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
