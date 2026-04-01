import React, { useEffect } from 'react'

export default function PageHeader({ title, subtitle, icon }) {
  // Update topbar title
  useEffect(() => {
    const el = document.getElementById('topbar-page-title')
    if (el) el.textContent = title
  }, [title])

  return (
    <div className="mb-4">
      <h4 className="fw-bold mb-1">
        {icon && <i className={`bi ${icon} me-2 text-primary`} />}
        {title}
      </h4>
      {subtitle && <p className="text-muted mb-0 small">{subtitle}</p>}
    </div>
  )
}
