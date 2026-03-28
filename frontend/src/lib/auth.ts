import Cookies from 'js-cookie';

export const TOKEN_KEY = 'oska_token';

export function saveToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 7, secure: false });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!Cookies.get(TOKEN_KEY);
}
