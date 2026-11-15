/** Event form and list. Every event must reference an existing place. */
export default function EventSection({
  events, places, form, saving, loading, onFieldChange, onSubmit, onDelete,
}) {
  function formatDate(value) {
    if (!value) return ''
    return new Date(`${value}T00:00:00`).toLocaleDateString('es-CO')
  }

  return (
    <section className="list-block" aria-labelledby="events-title">
      <div className="section-heading">
        <div><p className="eyebrow">AGENDA CULTURAL</p><h2 id="events-title">Eventos</h2></div>
        <span className="counter" aria-label={`${events.length} eventos`}>{events.length}</span>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <label htmlFor="event-place">Lugar
          <select id="event-place" required value={form.lugar}
            onChange={(event) => onFieldChange('lugar', event.target.value)}>
            <option value="">Selecciona un lugar</option>
            {places.map((place) => <option key={place.id} value={place.id}>{place.nombre}</option>)}
          </select>
        </label>

        <label htmlFor="event-name">Nombre del evento
          <input id="event-name" required maxLength="150" value={form.nombre}
            onChange={(event) => onFieldChange('nombre', event.target.value)} placeholder="Ej. Recorrido patrimonial" />
        </label>

        <label htmlFor="event-description" className="field-full">Descripción
          <textarea id="event-description" required rows="2" value={form.descripcion}
            onChange={(event) => onFieldChange('descripcion', event.target.value)} placeholder="Describe la actividad" />
        </label>

        <label htmlFor="event-date">Fecha (opcional)
          <input id="event-date" type="date" value={form.fecha}
            onChange={(event) => onFieldChange('fecha', event.target.value)} />
        </label>

        <div className="form-actions">
          <button className="button button-primary" disabled={saving || places.length === 0}>
            {saving ? 'Guardando…' : 'Crear evento'}
          </button>
          {places.length === 0 && <span className="hint">Crea un lugar antes de registrar un evento.</span>}
        </div>
      </form>

      <div className="place-list event-list">
        {events.map((item) => (
          <article className="place-card" key={item.id}>
            <div className="place-topline">
              <span className="tag">{item.lugar_nombre}</span>
              <span className="place-id">#{item.id}</span>
            </div>
            <h3>{item.nombre}</h3>
            <p className="place-description">{item.descripcion}</p>
            {item.fecha && <p className="place-address">Fecha: {formatDate(item.fecha)}</p>}
            <div className="card-actions">
              <button type="button" className="button button-quiet button-danger" disabled={saving} onClick={() => onDelete(item)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
      {events.length === 0 && !loading && <p className="empty">Aún no hay eventos.</p>}
    </section>
  )
}
