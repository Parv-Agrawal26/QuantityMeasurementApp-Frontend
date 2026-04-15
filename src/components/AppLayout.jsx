import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { toast } from 'react-toastify'


const NAV_GROUPS = [
  {
    section: 'Operations',
    items: [
      { to: '/compare', label: 'Compare', icon: 'bi-arrow-left-right' },
      { to: '/convert', label: 'Convert', icon: 'bi-arrow-repeat' },
      { to: '/arithmetic', label: 'Arithmetic', icon: 'bi-calculator' },
    ]
  },
  {
    section: 'Data',
    protected: true,
    items: [
      { to: '/history', label: 'History', icon: 'bi-clock-history' },
      { to: '/stats', label: 'Statistics', icon: 'bi-bar-chart-fill' },
    ]
  }
]

export default function AppLayout() {
  const { token, email, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authAPI.logout(token)
    } catch (err) {
      console.error(err)
    }
    logout()
    toast.info('Logged out successfully.')
    navigate('/compare')
  }

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
        <div className="sidebar-brand">⚖️ QM App</div>

        <div className="mt-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.section}>
              
              {/* Section Title */}
              <div className="sidebar-section d-flex align-items-center gap-1">
                {group.section}
                {group.protected && (
                  <span className="ms-1" title="Login required">
                    <i className="bi bi-lock-fill" style={{ fontSize: '0.65rem' }} />
                  </span>
                )}
              </div>

              {/* Items */}
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`bi ${item.icon}`} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
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
              <div className="sidebar-user-email">
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
        <header className="topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-outline-secondary d-md-none"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-list" />
            </button>
            <span className="topbar-title">
              Quantity Measurement
            </span>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}