/** Shows request status in one accessible place above the resource forms. */
export default function StatusBanner({ loading, error, notice }) {
  return (
    <section className="status-area" aria-live="polite" aria-atomic="true">
      {loading && <p className="status status-loading" role="status">Cargando información…</p>}
      {error && <p className="status status-error" role="alert">{error}</p>}
      {notice && !error && <p className="status status-success" role="status">{notice}</p>}
    </section>
  )
}
