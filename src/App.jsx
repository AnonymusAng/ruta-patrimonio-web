import { useCallback, useEffect, useState } from 'react'
import CategorySection from './components/CategorySection.jsx'
import EventSection from './components/EventSection.jsx'
import PlaceSection from './components/PlaceSection.jsx'
import StatusBanner from './components/StatusBanner.jsx'
import { api } from './api.js'

const emptyCategory = { nombre: '', descripcion: '' }
const emptyPlace = { categoria: '', nombre: '', descripcion: '', direccion: '' }
const emptyEvent = { lugar: '', nombre: '', descripcion: '', fecha: '' }

/** Coordinates API state and passes focused data/actions to each section. */
export default function App() {
  const [categories, setCategories] = useState([])
  const [places, setPlaces] = useState([])
  const [events, setEvents] = useState([])
  const [categoryForm, setCategoryForm] = useState(emptyCategory)
  const [placeForm, setPlaceForm] = useState(emptyPlace)
  const [eventForm, setEventForm] = useState(emptyEvent)
  const [editingPlaceId, setEditingPlaceId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // Load related resources together so the forms have their FK options ready.
  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [categoryData, placeData, eventData] = await Promise.all([
        api.listCategories(),
        api.listPlaces(),
        api.listEvents(),
      ])
      setCategories(categoryData)
      setPlaces(placeData)
      setEvents(eventData)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Reuse the same save/error/refresh flow for every create or update action.
  async function runMutation(action, successMessage, afterSuccess) {
    setSaving(true)
    setError('')
    setNotice('')

    try {
      await action()
      afterSuccess?.()
      setNotice(successMessage)
      await loadData()
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleCategorySubmit(event) {
    event.preventDefault()
    await runMutation(
      () => api.createCategory(categoryForm),
      'Categoría creada correctamente.',
      () => setCategoryForm(emptyCategory),
    )
  }

  async function handlePlaceSubmit(event) {
    event.preventDefault()
    const payload = {
      ...placeForm,
      categoria: Number(placeForm.categoria),
      activo: true,
    }
    const isEditing = editingPlaceId !== null
    const action = isEditing
      ? () => api.updatePlace(editingPlaceId, payload)
      : () => api.createPlace(payload)

    await runMutation(
      action,
      isEditing ? 'Lugar actualizado correctamente.' : 'Lugar creado correctamente.',
      cancelPlaceEdit,
    )
  }

  function startPlaceEdit(place) {
    setEditingPlaceId(place.id)
    setPlaceForm({
      categoria: String(place.categoria),
      nombre: place.nombre,
      descripcion: place.descripcion,
      direccion: place.direccion || '',
    })
    setNotice('Editando el lugar seleccionado.')
    setError('')
  }

  function cancelPlaceEdit() {
    setEditingPlaceId(null)
    setPlaceForm(emptyPlace)
  }

  async function handleEventSubmit(event) {
    event.preventDefault()
    const payload = {
      ...eventForm,
      lugar: Number(eventForm.lugar),
      fecha: eventForm.fecha || null,
    }

    await runMutation(
      () => api.createEvent(payload),
      'Evento creado correctamente.',
      () => setEventForm(emptyEvent),
    )
  }

  // Confirm destructive actions and keep related records protected by the API.
  async function handleDelete(resource, record, label) {
    if (!window.confirm(`¿Eliminar ${label} «${record.nombre}»?`)) return
    const resourceNames = { categoría: 'Categoría', lugar: 'Lugar', evento: 'Evento' }
    await runMutation(
      () => resource(record.id),
      `${resourceNames[label]} eliminado correctamente.`,
    )
  }

  return (
    <main className="page-shell">
      <header className="hero">
        <div className="hero-mark" aria-hidden="true">RP</div>
        <div>
          <p className="eyebrow">CATÁLOGO CULTURAL</p>
          <h1>Ruta Patrimonio Popayán</h1>
          <p className="hero-copy">Organiza categorías y descubre lugares históricos de la ciudad.</p>
        </div>
        <div className="hero-count" aria-label={`${places.length} lugares registrados`}>
          <strong>{places.length}</strong><span>lugares</span>
        </div>
      </header>

      <StatusBanner loading={loading} error={error} notice={notice} />

      <section className="content-grid" aria-label="Administración del catálogo">
        <CategorySection
          categories={categories}
          form={categoryForm}
          saving={saving}
          loading={loading}
          onFieldChange={(field, value) => setCategoryForm((current) => ({ ...current, [field]: value }))}
          onSubmit={handleCategorySubmit}
          onDelete={(category) => handleDelete(api.deleteCategory, category, 'categoría')}
        />

        <div className="panel panel-wide">
          <PlaceSection
            categories={categories}
            places={places}
            form={placeForm}
            editingId={editingPlaceId}
            saving={saving}
            loading={loading}
            onFieldChange={(field, value) => setPlaceForm((current) => ({ ...current, [field]: value }))}
            onSubmit={handlePlaceSubmit}
            onEdit={startPlaceEdit}
            onCancelEdit={cancelPlaceEdit}
            onDelete={(place) => handleDelete(api.deletePlace, place, 'lugar')}
          />

          <EventSection
            events={events}
            places={places}
            form={eventForm}
            saving={saving}
            loading={loading}
            onFieldChange={(field, value) => setEventForm((current) => ({ ...current, [field]: value }))}
            onSubmit={handleEventSubmit}
            onDelete={(item) => handleDelete(api.deleteEvent, item, 'evento')}
          />
        </div>
      </section>

      <footer className="footer">Proyecto académico · Django REST Framework + React</footer>
    </main>
  )
}
