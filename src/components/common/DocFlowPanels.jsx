import { useEffect, useState } from 'react';
import { auditService } from '../../services/dataService';
import './DocFlowPanels.css';

/** stages: [{ key, label }], statuses: { key: 'Completed'|'Current'|'Pending'|'Cancelled'|'Rejected' } */
export function DocumentFlow({ stages, statuses, onStageClick }) {
  return (
    <div className="docflow">
      {stages.map((s, i) => {
        const status = statuses[s.key] || 'Pending';
        return (
          <div className="docflow-stage" key={s.key}>
            <button
              className={`docflow-node docflow-${status.toLowerCase()}`}
              onClick={() => onStageClick && onStageClick(s.key)}
              title={`${s.label}: ${status}`}
            >
              <span className="docflow-dot" />
              <span className="docflow-label">{s.label}</span>
              <span className="docflow-status">{status}</span>
            </button>
            {i < stages.length - 1 && <span className="docflow-connector" />}
          </div>
        );
      })}
    </div>
  );
}

export function ApprovalPanel({ approvalStatus, approvalHistory = [], onApprove, onReject, onReturn, canApprove = true }) {
  const [comment, setComment] = useState('');
  return (
    <div className="panel-block">
      <div className="panel-block-header">
        <h4>Approval Workflow</h4>
        <span className={`status-badge status-${approvalStatus === 'Approved' ? 'success' : approvalStatus === 'Rejected' ? 'danger' : 'warning'}`}>
          {approvalStatus}
        </span>
      </div>

      {approvalHistory.length > 0 && (
        <ul className="approval-history">
          {approvalHistory.map((h, i) => (
            <li key={i}>
              <strong>{h.approver}</strong> — {h.action} <span className="approval-time">{h.date}</span>
              {h.comment && <div className="approval-comment">"{h.comment}"</div>}
            </li>
          ))}
        </ul>
      )}

      {canApprove && approvalStatus === 'Pending' && (
        <div className="approval-actions">
          <textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
          />
          <div className="approval-btn-row">
            <button className="btn btn-sm btn-primary" onClick={() => onApprove(comment)}>Approve</button>
            <button className="btn btn-sm btn-danger" onClick={() => onReject(comment)}>Reject</button>
            <button className="btn btn-sm" onClick={() => onReturn(comment)}>Return for Correction</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AuditTrail({ documentId }) {
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    auditService.forDocument(documentId).then(setEntries);
  }, [documentId]);

  return (
    <div className="panel-block">
      <div className="panel-block-header"><h4>Audit Trail</h4></div>
      {entries.length === 0 ? (
        <p className="panel-empty">No changes recorded yet.</p>
      ) : (
        <ul className="audit-list">
          {entries.map((e) => (
            <li key={e.id}>
              <div className="audit-row-top">
                <strong>{e.user}</strong>
                <span className="audit-time">{new Date(e.timestamp).toLocaleString()}</span>
              </div>
              <div>{e.action}{e.previousValue !== undefined && (
                <span className="audit-diff"> — {e.previousValue} → {e.newValue}</span>
              )}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AttachmentPanel({ attachments = [], onAdd, onRemove }) {
  return (
    <div className="panel-block">
      <div className="panel-block-header">
        <h4>Attachments</h4>
        <label className="btn btn-sm attach-btn">
          + Add File
          <input
            type="file"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onAdd(f.name);
              e.target.value = '';
            }}
          />
        </label>
      </div>
      {attachments.length === 0 ? (
        <p className="panel-empty">No attachments added.</p>
      ) : (
        <ul className="attachment-list">
          {attachments.map((a, i) => (
            <li key={i}>
              <span>📎 {a}</span>
              <button className="btn btn-sm btn-danger" onClick={() => onRemove(i)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RelatedDocuments({ items = [] }) {
  return (
    <div className="panel-block">
      <div className="panel-block-header"><h4>Related Documents</h4></div>
      {items.length === 0 ? (
        <p className="panel-empty">No related documents.</p>
      ) : (
        <ul className="related-doc-list">
          {items.map((d, i) => (
            <li key={i}>
              <span className="related-doc-type">{d.type}</span>
              <span>{d.docNo}</span>
              <span className={`status-badge status-${d.status === 'Completed' ? 'success' : 'warning'}`}>{d.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
