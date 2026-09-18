import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { findBreadcrumb } from '../../config/navigation';
import { globalSearch, notificationService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';
import AppearanceModal from './AppearanceModal';
import './Header.css';

export default function Header({ onToggleMobileSidebar }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumb = findBreadcrumb(location.pathname);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    notificationService.list().then(setNotifications);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const searchToken = useRef(0);

  const handleSearch = async (v) => {
    setQuery(v);
    if (!v.trim()) { setSearchOpen(false); return; }
    const token = ++searchToken.current;
    const results = await globalSearch(v);
    if (token === searchToken.current) { // ignore stale responses from earlier keystrokes
      setSearchResults(results);
      setSearchOpen(true);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id) => {
    await notificationService.markRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <header className="topbar">
      <button className="hamburger" onClick={onToggleMobileSidebar} aria-label="Toggle menu">☰</button>

      <div className="topbar-titles">
        <div className="breadcrumb">
          {breadcrumb.map((b, i) => (
            <span key={i}>
              {i > 0 && <span className="breadcrumb-sep">/</span>}
              {b}
            </span>
          ))}
        </div>
        <h2 className="page-title">{breadcrumb[breadcrumb.length - 1]}</h2>
      </div>

      <div className="topbar-search" ref={searchRef}>
        <span className="search-icon">⌕</span>
        <input
          placeholder="Search materials, partners, documents…"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setSearchOpen(true)}
        />
        {searchOpen && (
          <div className="search-dropdown">
            {searchResults.length === 0 ? (
              <div className="search-empty">No results for "{query}"</div>
            ) : (
              Object.entries(
                searchResults.reduce((acc, r) => {
                  (acc[r.module] ||= []).push(r);
                  return acc;
                }, {})
              ).map(([module, items]) => (
                <div key={module} className="search-group">
                  <div className="search-group-label">{module}</div>
                  {items.map((it, i) => (
                    <button
                      key={i}
                      className="search-result-item"
                      onClick={() => { navigate(it.route); setSearchOpen(false); setQuery(''); }}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="topbar-actions">
        <div className="notif-wrap" ref={notifRef}>
          <button className="icon-btn" onClick={() => setNotifOpen((s) => !s)}>
            🔔
            {unreadCount > 0 && <span className="notif-dot">{unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">Notifications</div>
              {notifications.length === 0 ? (
                <div className="search-empty">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} onClick={() => markRead(n.id)}>
                    <div className="notif-type">{n.type}</div>
                    <div className="notif-msg">{n.message}</div>
                    <div className="notif-date">{new Date(n.date).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="profile-wrap" ref={profileRef}>
          <button className="profile-btn" onClick={() => setProfileOpen((s) => !s)}>
            <span className="avatar">{(user?.displayName || 'U').slice(0, 1)}</span>
            <span className="profile-name">{user?.displayName}</span>
          </button>
          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="avatar avatar-lg">{(user?.displayName || 'U').slice(0, 1)}</div>
                <div>
                  <div className="profile-dropdown-name">{user?.displayName}</div>
                  <div className="profile-dropdown-role">{user?.role}</div>
                </div>
              </div>
              <button className="profile-dropdown-item" onClick={() => { setAppearanceOpen(true); setProfileOpen(false); }}>
                Appearance
              </button>
              <button className="profile-dropdown-item" onClick={() => { setChangePwOpen(true); setProfileOpen(false); }}>
                Change Password
              </button>
              <button className="profile-dropdown-item danger" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal open={changePwOpen} onClose={() => setChangePwOpen(false)} />
      <AppearanceModal open={appearanceOpen} onClose={() => setAppearanceOpen(false)} />
    </header>
  );
}
