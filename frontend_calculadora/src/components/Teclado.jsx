// Teclado.jsx – teclas visibles de la calculadora

import { OPERACIONES } from "../services/calculadoraService";

const operacion = (id) => OPERACIONES.find((o) => o.id === id);

export default function Teclado({
  onDigito, onPunto, onOperacion, onIgual, onLimpiar, onBorrar, onSigno, deshabilitado,
}) {
  const digito = (n, extra = "") => (
    <button className={`tecla ${extra}`} onClick={() => onDigito(n)} disabled={deshabilitado}>
      {n}
    </button>
  );

  const tecla = (op) => (
    <button
      className="tecla tecla-operacion"
      aria-label={op.boton}
      title={op.boton}
      onClick={() => onOperacion(op)}
      disabled={deshabilitado}
    >
      <span className="simbolo">{op.simbolo}</span>
      <small>{op.boton}</small>
    </button>
  );

  return (
    <div className="teclado">
      <button className="tecla tecla-accion" aria-label="Limpiar" onClick={onLimpiar} disabled={deshabilitado}>
        C
      </button>
      <button className="tecla tecla-accion" aria-label="Borrar" onClick={onBorrar} disabled={deshabilitado}>
        ⌫
      </button>
      <button className="tecla tecla-accion" aria-label="Cambiar signo" onClick={onSigno} disabled={deshabilitado}>
        ±
      </button>
      {tecla(operacion("division"))}

      {digito("7")}
      {digito("8")}
      {digito("9")}
      {tecla(operacion("multiplicacion"))}

      {digito("4")}
      {digito("5")}
      {digito("6")}
      {tecla(operacion("resta"))}

      {digito("1")}
      {digito("2")}
      {digito("3")}
      {tecla(operacion("suma"))}

      {digito("0", "tecla-cero")}
      <button className="tecla" aria-label="Punto decimal" onClick={onPunto} disabled={deshabilitado}>
        .
      </button>
      <button className="tecla tecla-igual" aria-label="Igual" onClick={onIgual} disabled={deshabilitado}>
        =
      </button>
    </div>
  );
}
