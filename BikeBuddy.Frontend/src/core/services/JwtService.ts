const ID_TOKEN_KEY = "id_token" as string;

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  window.localStorage.setItem(ID_TOKEN_KEY, `${token}`);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

type TokenPayload = {
  exp: number;
  email : string;
  nameId: string;
  name: string;
}

export const decodeToken = (token: string | null = getToken()): TokenPayload | null => {
  try {
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const parsedPayload = JSON.parse(jsonPayload);

    // Извлекаем и упрощаем
    const { 
      ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]: nameId, 
      ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]: name, 
      ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]: email, 
      ...rest 
    } = parsedPayload;

    // Возвращаем объект без длинных ключей
    return {
      ...rest,
      nameId,
      name,
      email
    };
  } catch (error) {
    console.error('Ошибка при декодировании токена:', error);
    return null;
  }
};

export const isTokenExpired = (token: string | null = getToken()): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  console.log(currentTime, "   ", payload.exp)
  return payload.exp < currentTime;
}

export default { getToken, saveToken, destroyToken, decodeToken, isTokenExpired };
