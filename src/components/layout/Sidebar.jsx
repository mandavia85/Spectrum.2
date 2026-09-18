import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navigation } from '../../config/navigation';
import { branding } from '../../config/branding';
import './Sidebar.css';

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState(() => {
    const active = navigation.find((n) => n.children?.some((c) => location.pathname.startsWith(c.path)));
    return active ? { [active.key]: true } : {};
  });

  const toggleGroup = (key) => {
    if (collapsed) return;
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-scrim" onClick={onCloseMobile} />}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-mark">{branding.logoText[0].toUpperCase()}</span>
          {!collapsed && (
            <span className="brand-text">
              {branding.logoText}<span className="brand-accent">{branding.logoAccent}</span>
            </span>
          )}
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const isParentActive = item.path
              ? location.pathname === item.path
              : item.children?.some((c) => location.pathname.startsWith(c.path));

            if (!item.children) {
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={onCloseMobile}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            }

            const isOpen = collapsed ? isParentActive : !!openGroups[item.key];

            return (
              <div key={item.key} className="sidebar-group">
                <button
                  className={`sidebar-link sidebar-group-toggle ${isParentActive ? 'active' : ''}`}
                  onClick={() => toggleGroup(item.key)}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span>{item.label}</span>
                      <span className={`sidebar-chevron ${isOpen ? 'open' : ''}`}>›</span>
                    </>
                  )}
                </button>
                {!collapsed && isOpen && (
                  <div className="sidebar-submenu">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => `sidebar-sublink ${isActive ? 'active' : ''}`}
                        onClick={onCloseMobile}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
                {collapsed && (
                  <div className="sidebar-flyout">
                    {item.children.map((child) => (
                      <NavLink key={child.path} to={child.path} className="sidebar-flyout-link" onClick={onCloseMobile}>
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button className="sidebar-collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? '»' : '« Collapse'}
        </button>
      </aside>
    </>
  );
}
