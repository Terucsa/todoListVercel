import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { error?: unknown } | undefined)?.error;

    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      return apiMessage;
    }

    if (error.code === 'ERR_NETWORK') {
      return 'No se pudo conectar con el servidor. Comprueba que la API esté en marcha.';
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Ha ocurrido un error inesperado';
}
