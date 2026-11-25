// MensajeError.jsx – área de mensajes de error

export default function MensajeError({ error }) {
  return (
    <section className="area">
      <h2>Mensajes de error</h2>
      {!error ? (
        <p className="vacio">Sin errores.</p>
      ) : (
        <div className="error" role="alert">
          <strong>{error.titulo}</strong>
          <p>{error.mensaje}</p>
        </div>
      )}
    </section>
  );
}
