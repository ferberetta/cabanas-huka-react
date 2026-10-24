export default function Field({ label, id, error, children }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="error-msg" role="alert">{error}</span>}
    </div>
  )
}
