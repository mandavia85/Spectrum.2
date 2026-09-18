// Each theme reassigns the SAME custom property names already used across
// every component's CSS, so switching themes requires no per-component changes.
export const themes = {
  'sap-classic': {
    label: 'SAP Classic',
    swatch: ['#52667A', '#8FA6BC', '#F5F5F2'],
    vars: {
      '--navy-900': '#3E4C59', '--navy-800': '#46566A', '--navy-700': '#55697F', '--navy-600': '#66809A',
      '--slate-50': '#F5F5F2', '--slate-100': '#ECECE6', '--slate-200': '#DCDCD2', '--slate-300': '#C6C6B9',
      '--slate-400': '#A3A395', '--slate-500': '#7D7D6E', '--slate-600': '#5C5C50', '--slate-700': '#3F3F36', '--slate-800': '#28281F',
      '--teal-600': '#4A6FA1', '--teal-700': '#3A5A85',
      '--success': '#3E7D3A', '--success-bg': '#E9F1E3',
      '--warning': '#B8790E', '--warning-bg': '#FBF0DA',
      '--danger': '#B0392E', '--danger-bg': '#F8E7E4',
      '--info': '#4A6FA1', '--info-bg': '#E7EDF6',
      '--radius-sm': '3px', '--radius-md': '4px', '--radius-lg': '6px',
      '--shadow-card': '0 1px 2px rgba(40,40,31,0.08)',
      '--shadow-pop': '0 6px 20px rgba(40,40,31,0.28)',
      '--font-sans': "'Segoe UI', Tahoma, Arial, sans-serif",
      '--row-hover-bg': '#FBF0D3',
    },
  },
  'modern-teal': {
    label: 'Modern Teal',
    swatch: ['#0F2137', '#0E7C86', '#F5F7FA'],
    vars: {
      '--navy-900': '#0F2137', '--navy-800': '#16324A', '--navy-700': '#1D4360', '--navy-600': '#24537A',
      '--slate-50': '#F5F7FA', '--slate-100': '#EEF1F5', '--slate-200': '#E2E7EE', '--slate-300': '#CBD3DE',
      '--slate-400': '#9AA6B5', '--slate-500': '#6B7688', '--slate-600': '#4C5566', '--slate-700': '#333B49', '--slate-800': '#202632',
      '--teal-600': '#0E7C86', '--teal-700': '#0B6570',
      '--success': '#157A46', '--success-bg': '#E5F5ED',
      '--warning': '#B45309', '--warning-bg': '#FDF3E4',
      '--danger': '#B91C1C', '--danger-bg': '#FBE9E9',
      '--info': '#1D4ED8', '--info-bg': '#E9EEFC',
      '--radius-sm': '4px', '--radius-md': '6px', '--radius-lg': '10px',
      '--shadow-card': '0 1px 2px rgba(15,33,55,0.06), 0 1px 3px rgba(15,33,55,0.08)',
      '--shadow-pop': '0 8px 24px rgba(15,33,55,0.16)',
      '--font-sans': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      '--row-hover-bg': '#F5F7FA',
    },
  },
  'emerald-business': {
    label: 'Emerald Business',
    swatch: ['#1C2B24', '#1D7A54', '#F6F7F5'],
    vars: {
      '--navy-900': '#1C2B24', '--navy-800': '#22362D', '--navy-700': '#2C4438', '--navy-600': '#375444',
      '--slate-50': '#F6F7F5', '--slate-100': '#EDEFEB', '--slate-200': '#DEE2DA', '--slate-300': '#C5CBC0',
      '--slate-400': '#98A091', '--slate-500': '#6E756A', '--slate-600': '#4E544A', '--slate-700': '#363B32', '--slate-800': '#212520',
      '--teal-600': '#1D7A54', '--teal-700': '#166342',
      '--success': '#1D7A54', '--success-bg': '#E4F2EA',
      '--warning': '#A6650F', '--warning-bg': '#FAEEDC',
      '--danger': '#AB3838', '--danger-bg': '#F6E5E5',
      '--info': '#2E6B8F', '--info-bg': '#E5EEF3',
      '--radius-sm': '4px', '--radius-md': '6px', '--radius-lg': '10px',
      '--shadow-card': '0 1px 2px rgba(28,43,36,0.08)',
      '--shadow-pop': '0 8px 24px rgba(28,43,36,0.22)',
      '--font-sans': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      '--row-hover-bg': '#EDF5F0',
    },
  },
};

export const DEFAULT_THEME = 'sap-classic';
