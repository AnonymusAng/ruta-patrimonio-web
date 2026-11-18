// Centraliza la dirección base y el manejo de errores HTTP de la API.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

function describeError(payload) {
  if (typeof payload === 'string') return payload
  if (payload?.detail) return payload.detail
  if (Array.isArray(payload)) return payload.map(describeError).filter(Boolean).join(' ')
  if (payload && typeof payload === 'object') {
    return Object.entries(payload)
      .map(([field, messages]) => `${field}: ${describeError(messages)}`)
      .join(' ')
  }
  return ''
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que Django esté ejecutándose y que CORS permita este origen.')
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || ''
    const body = contentType.includes('application/json')
      ? await response.json().catch(() => ({}))
      : await response.text()
    throw new Error(describeError(body) || `La solicitud falló (${response.status}).`)
  }

  return response.status === 204 ? null : response.json()
}

// Métodos reutilizables: la UI no repite rutas ni construcción de JSON.
export const api = {
  listCategories: () => request('/categorias/'),
  createCategory: (data) => request('/categorias/', { method: 'POST', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categorias/${id}/`, { method: 'DELETE' }),
  listPlaces: () => request('/lugares/'),
  createPlace: (data) => request('/lugares/', { method: 'POST', body: JSON.stringify(data) }),
  updatePlace: (id, data) => request(`/lugares/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlace: (id) => request(`/lugares/${id}/`, { method: 'DELETE' }),
 listEvents: () => request('/eventos/'),
createEvent: (data) => request('/eventos/', { method: 'POST', body: JSON.stringify(data) }),
updateEvent: (id, data) => request(`/eventos/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
deleteEvent: (id) => request(`/eventos/${id}/`, { method: 'DELETE' }),  
}
