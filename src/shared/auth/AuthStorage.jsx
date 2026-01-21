const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const USER_ID_KEY = "userId";

const AuthStorage = {
  setSession({ token, role, userId }) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    if (userId != null) localStorage.setItem(USER_ID_KEY, String(userId));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getRole() {
    return localStorage.getItem(ROLE_KEY);
  },
  getUserId() {
    const v = localStorage.getItem(USER_ID_KEY);
    return v ? Number(v) : null;
  },
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default AuthStorage;