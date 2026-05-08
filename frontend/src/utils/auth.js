export const TOKEN_STORAGE_KEY = 'token';
export const USER_STORAGE_KEY = 'user';
export const AUTH_MODE_STORAGE_KEY = 'authMode';

export const AUTH_MODE_SERVER = 'server';
export const AUTH_MODE_OFFLINE = 'offline';

export const isJwtToken = (token) => (
  typeof token === 'string' && token.split('.').length === 3
);

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const getStoredAuthMode = () => localStorage.getItem(AUTH_MODE_STORAGE_KEY);

export const getStoredUser = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const isServerSession = (
  token = getStoredToken(),
  authMode = getStoredAuthMode()
) => authMode === AUTH_MODE_SERVER && isJwtToken(token);

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(AUTH_MODE_STORAGE_KEY);
};
