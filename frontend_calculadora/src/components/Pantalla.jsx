// Pantalla.jsx – display de la calculadora

export default function Pantalla({ expresion, valor, onCambio, onTecla }) {
  return (
    <div className="pantalla">
      <div className="expresion" aria-live="polite">
        {expresion || "\u00A0"}
      </div>
      {/* Se puede escribir con el teclado del computador o con las teclas de la pantalla */}
      <input
        className="valor-pantalla"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        aria-label="Pantalla"
        placeholder="0"
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        onKeyDown={onTecla}
      />
    </div>
  );
}
