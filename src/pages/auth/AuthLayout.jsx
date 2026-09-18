import { branding } from '../../config/branding';
import './Auth.css';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="auth-logo-mark">{branding.logoText}</span>
            <span className="auth-logo-accent">{branding.logoAccent}</span>
          </div>
          {children}
        </div>
        <div className="auth-footer-note">© {new Date().getFullYear()} {branding.companyName}. All rights reserved.</div>
      </div>

      <div className="auth-right">
        <div className="auth-right-inner">
          <h3>{branding.loginNewsHeading}</h3>
          <div className="auth-news-list">
            {branding.loginNews.map((item, i) => (
              <div className="auth-news-card" key={i}>
                <div className="auth-news-top">
                  <h4>{item.title}</h4>
                  {item.badge && <span className="auth-news-badge">{item.badge}</span>}
                </div>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-right-pattern" aria-hidden="true" />
      </div>
    </div>
  );
}
