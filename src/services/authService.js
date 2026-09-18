const SESSION_KEY = 'erp_session';
const USER_KEY = 'erp_credentials';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const DEFAULT_CREDENTIALS = {
  username: 'noman',
  password: 'noman@123',
  displayName: 'Noman Ahmed',
  email: 'noman@company.com',
  role: 'Administrator',
};

function getCredentials() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
    return DEFAULT_CREDENTIALS;
  }
  return JSON.parse(raw);
}

function setCredentials(creds) {
  localStorage.setItem(USER_KEY, JSON.stringify(creds));
}

function delay(ms = 250) {
  return new Promise((res) => setTimeout(res, ms));
}

export const authService = {
  async login(username, password, rememberMe) {
    await delay();
    const creds = getCredentials();
    if (username.trim().toLowerCase() === creds.username.toLowerCase() && password === creds.password) {
      const session = {
        username: creds.username,
        displayName: creds.displayName,
        email: creds.email,
        role: creds.role,
        loginAt: Date.now(),
        lastActivity: Date.now(),
        rememberMe: !!rememberMe,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { success: true, user: session };
    }
    return { success: false, message: 'Invalid username or password.' };
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() - session.lastActivity > SESSION_TIMEOUT_MS) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  },

  touchSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const session = JSON.parse(raw);
    session.lastActivity = Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  async requestPasswordReset(usernameOrEmail) {
    await delay();
    const creds = getCredentials();
    const match =
      usernameOrEmail.trim().toLowerCase() === creds.username.toLowerCase() ||
      usernameOrEmail.trim().toLowerCase() === creds.email.toLowerCase();
    if (!match) {
      return { success: false, message: 'No account found with that username or email.' };
    }
    // Simulated verification code (shown in prototype instead of emailing it)
    const code = '482913';
    sessionStorage.setItem('erp_reset_code', code);
    sessionStorage.setItem('erp_reset_target', creds.username);
    return { success: true, code };
  },

  async verifyResetCode(code) {
    await delay();
    const expected = sessionStorage.getItem('erp_reset_code');
    if (code === expected) {
      return { success: true };
    }
    return { success: false, message: 'Invalid verification code.' };
  },

  async resetPassword(newPassword) {
    await delay();
    const creds = getCredentials();
    setCredentials({ ...creds, password: newPassword });
    sessionStorage.removeItem('erp_reset_code');
    sessionStorage.removeItem('erp_reset_target');
    return { success: true };
  },

  async changePassword(currentPassword, newPassword) {
    await delay();
    const creds = getCredentials();
    if (currentPassword !== creds.password) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    setCredentials({ ...creds, password: newPassword });
    return { success: true };
  },

  getCurrentUserProfile() {
    return getCredentials();
  },
};
