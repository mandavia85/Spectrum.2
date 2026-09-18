import { useMemo, useState } from 'react';
import { SearchBar, Pagination, EmptyState, LoadingSpinner, StatusBadge } from './UI';
import './DataTable.css';

/**
 * columns: [{ key, label, render?(row), width?, align?, sortable? }]
 * rows: array of records (already filtered by caller if needed, e.g. tab filters)
 */
export default function DataTable({
  columns,
  rows,
  loading,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  filters, // optional extra filter controls rendered next to search
  pageSize = 8,
  onRowClick,
  actions, // (row) => JSX for row-level action buttons
  emptyTitle,
  emptyMessage,
  toolbarRight, // extra buttons e.g. "Add New"
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const filtered = useMemo(() => {
    let data = rows;
    if (query && searchKeys.length) {
      const q = query.toLowerCase();
      data = data.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)));
    }
    if (sortKey) {
      data = [...data].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av;
        }
        return sortDir === 'asc'
          ? String(av ?? '').localeCompare(String(bv ?? ''))
          : String(bv ?? '').localeCompare(String(av ?? ''));
      });
    }
    return data;
  }, [rows, query, searchKeys, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  return (
    <div className="datatable-wrap">
      <div className="datatable-toolbar">
        <SearchBar value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder={searchPlaceholder} />
        {filters}
        <div className="datatable-toolbar-right">{toolbarRight}</div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading records…" />
      ) : filtered.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      ) : (
        <>
          <div className="datatable-scroll">
            <table className="datatable">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={{ width: col.width, textAlign: col.align || 'left' }}
                      className={col.sortable ? 'sortable' : ''}
                      onClick={() => handleSort(col)}
                    >
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        <span className="sort-arrow">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>
                      )}
                    </th>
                  ))}
                  {actions && <th style={{ width: 110 }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, idx) => (
                  <tr key={row.id || idx} onClick={() => onRowClick && onRowClick(row)} className={onRowClick ? 'clickable' : ''}>
                    {columns.map((col) => (
                      <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                        {col.render ? col.render(row) : col.key === 'status' ? <StatusBadge status={row.status} /> : row[col.key]}
                      </td>
                    ))}
                    {actions && (
                      <td onClick={(e) => e.stopPropagation()} className="actions-cell">
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
