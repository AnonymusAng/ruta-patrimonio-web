import { useMemo, useState } from 'react'

/** Handles place creation, the optional edit bonus, and place removal. */
export default function PlaceSection({
  categories, places, form, editingId, saving, loading,
  onFieldChange, onSubmit, onEdit, onCancelEdit, onDelete,
}) {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const visiblePlaces = useMemo(() => places.filter((item) => {
    const matchesText = `${item.nombre} ${item.descripcion} ${item.direccion}`.toLowerCase().includes(query.trim().toLowerCase())
    const matchesCategory = !categoryFilter || String(item.categoria) === categoryFilter
    return matchesText && matchesCategory
  }), [places, query, categoryFilter])

  return (
    <section aria-labelledby="places-title">
      <div className="section-heading">
        <div><p className="eyebrow">LUGARES DE INTERÉS</p><h2 id="places-title">{editingId ? 'Editar lugar' : 'Lugares'}</h2></div>
        <span className="counter" aria-label={`${places.length} lugares`}>{places.length}</span>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <label htmlFor="place-category">Categoría
          <select id="place-category" required value={form.categoria}
            onChange={(event) => onFieldChange('categoria', event.target.value)}>
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}
          </select>
        </label>

        <label htmlFor="place-name">Nombre del lugar
          <input id="place-name" required maxLength="150" value={form.nombre}
            onChange={(event) => onFieldChange('nombre', event.target.value)} placeholder="Ej. Torre del Reloj" />
        </label>

        <label htmlFor="place-description" className="field-full">Descripción
          <textarea id="place-description" required rows="3" value={form.descripcion}
            onChange={(event) => onFieldChange('descripcion', event.target.value)}
            placeholder="¿Qué hace representativo a este lugar?" />
        </label>

        <label htmlFor="place-address" className="field-full">Dirección o referencia
          <input id="place-address" maxLength="200" value={form.direccion}
            onChange={(event) => onFieldChange('direccion', event.target.value)} placeholder="Ej. Parque Caldas" />
        </label>

        <div className="form-actions field-full">
          <button className="button button-primary" disabled={saving || categories.length === 0}>
            {saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear lugar'}
          </button>
          {editingId !== null && <button type="button" className="button button-secondary" onClick={onCancelEdit}>Cancelar</button>}
          {categories.length === 0 && <span className="hint">Crea una categoría antes de registrar un lugar.</span>}
        </div>
      </form>

      <div className="list-block">
        <h3>Lugares registrados</h3>
        <label htmlFor="place-search">Buscar lugar<input id="place-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, descripción o dirección" /></label>
        <label htmlFor="place-category-filter">Filtrar por categoría<select id="place-category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="">Todas</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select></label>
        {places.length === 0 && !loading && <p className="empty">Aún no hay lugares.</p>}
        <button type="button" className="button button-secondary" onClick={() => { setQuery(''); setCategoryFilter('') }}>Limpiar filtros</button>
        <p className="hint" aria-live="polite">Mostrando {visiblePlaces.length} de {places.length} lugares.</p>
        <div className="place-list">
          {visiblePlaces.map((place) => (
            <article className="place-card" key={place.id}>
              <div className="place-topline">
                <span className="tag">{place.categoria_nombre}</span>
                <span className="place-id">#{place.id}</span>
              </div>
              <h3>{place.nombre}</h3>
              <p className="place-description">{place.descripcion}</p>
              {place.direccion && <p className="place-address">⌖ {place.direccion}</p>}
              <div className="card-actions">
                <button type="button" className="button button-quiet" disabled={saving} onClick={() => onEdit(place)}>Editar</button>
                <button type="button" className="button button-quiet button-danger" disabled={saving} onClick={() => onDelete(place)}>Eliminar</button>
              </div>
            </article>
          ))}
        </div>
        {places.length > 0 && visiblePlaces.length === 0 && <p className="empty">No hay lugares que coincidan con los filtros.</p>}
      </div>
    </section>
  )
}
