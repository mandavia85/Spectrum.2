import { useNavigate } from 'react-router-dom';
import './FormPage.css';

/**
 * Full-screen ERP record page — replaces "Add/Edit modal" for anything that
 * is a real record (materials, partners, documents), per navigation rules:
 * only Quick Create / Quick View should be a popup.
 */
export default function FormPage({ title, subtitle, statusSlot, backTo, onBack, actions, children, loading }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) return onBack();
    if (backTo) return navigate(backTo);
    navigate(-1);
  };

  return (
    <div className="form-page">
      <div className="form-page-header">
        <div className="form-page-title-row">
          <button className="form-page-back" onClick={handleBack} aria-label="Back">←</button>
          <div>
            <div className="form-page-title-line">
              <h1>{title}</h1>
              {statusSlot}
            </div>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
        <div className="form-page-actions">{actions}</div>
      </div>

      <div className="form-page-body">
        {loading ? <div className="loading-state">Loading…</div> : children}
      </div>
    </div>
  );
}
