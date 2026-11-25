// Resultado.jsx – área de resultado

export default function Resultado({ resultado }) {
  return (
    <section className="area">
      <h2>Resultado</h2>
      {!resultado ? (
        <p className="vacio">Escribe dos números y elige una operación.</p>
      ) : (
        <>
          <p className="operacion">
            {resultado.operacion}: {resultado.numero1} {resultado.simbolo} {resultado.numero2} ={" "}
            <strong className="valor">{resultado.resultado}</strong>
          </p>
          <p className="etiqueta-json">Respuesta JSON del Backend (código {resultado.status})</p>
          <pre>{JSON.stringify(resultado.json, null, 2)}</pre>
        </>
      )}
    </section>
  );
}
