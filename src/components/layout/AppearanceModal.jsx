import { Modal } from '../common/UI';
import { useTheme } from '../../context/ThemeContext';
import './AppearanceModal.css';

export default function AppearanceModal({ open, onClose }) {
  const { themeKey, setThemeKey, themes } = useTheme();

  return (
    <Modal open={open} onClose={onClose} title="Appearance" width={460}
      footer={<button className="btn btn-primary" onClick={onClose}>Done</button>}
    >
      <p className="appearance-hint">Choose a colour theme for the workspace. Your selection is saved to this browser and applied every time you sign in.</p>
      <div className="theme-grid">
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            className={`theme-option ${themeKey === key ? 'selected' : ''}`}
            onClick={() => setThemeKey(key)}
          >
            <span className="theme-swatch">
              {theme.swatch.map((c, i) => <span key={i} style={{ background: c }} />)}
            </span>
            <span className="theme-name">{theme.label}</span>
            {themeKey === key && <span className="theme-check">✓</span>}
          </button>
        ))}
      </div>
    </Modal>
  );
}
