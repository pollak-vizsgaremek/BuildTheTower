export async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api/v1${path}`, {
      ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: options.signal || AbortSignal.timeout(15000),
    });
  } catch (cause) {
    if (cause.name === 'AbortError') throw cause;
    throw new Error('A szerver nem érhető el. Ellenőrizd a kapcsolatot, majd próbáld újra.');
  }
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.message || 'A kérés sikertelen. Próbáld újra később.');
    error.status = response.status;
    error.fields = data?.fields || {};
    throw error;
  }
  return data;
}

export const api = (path, options) => request(`/auth${path}`, options);
export const projectsApi = (path = '', options) => request(`/projects${path}`, options);
