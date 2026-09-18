import { useEffect } from 'react';
import './UI.css';

export function Modal({ open, onClose, title, children, width = 640, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title = 'Confirm Action', message, confirmLabel = 'Delete', danger = true, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={onCancel}>
      <div className="modal-box" style={{ maxWidth: 400 }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0, color: 'var(--slate-600)', fontSize: 13 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className={danger ? 'btn btn-danger' : 'btn btn-primary'} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

const STATUS_MAP = {
  Active: 'success', Open: 'info', Draft: 'neutral', Pending: 'warning',
  Approved: 'success', Rejected: 'danger', Closed: 'neutral', Completed: 'success',
  Current: 'info', Cancelled: 'danger', Inactive: 'neutral', Paid: 'success',
  Unpaid: 'warning', Reconciled: 'success', Unreconciled: 'warning', Posted: 'success',
  Disposed: 'neutral',
};

export function StatusBadge({ status }) {
  const tone = STATUS_MAP[status] || 'neutral';
  return <span className={`status-badge status-${tone}`}>{status}</span>;
}

export function KPICard({ label, value, sub, tone = 'default', icon }) {
  return (
    <div className={`kpi-card kpi-${tone}`}>
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        {icon && <span className="kpi-icon">{icon}</span>}
      </div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button className="btn btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</button>
      <span className="pagination-info">Page {page} of {totalPages}</span>
      <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-bar">
      <span className="search-icon">⌕</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function EmptyState({ title = 'No records found', message = 'Try adjusting your filters or add a new record.', action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">▢</div>
      <h4>{title}</h4>
      <p>{message}</p>
      {action}
    </div>
  );
}

export function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function FormField({ label, error, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {error && <div className="error-text">{error}</div>}
      {!error && hint && <div className="hint">{hint}</div>}
    </div>
  );
}
