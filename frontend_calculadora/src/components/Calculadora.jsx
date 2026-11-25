// Calculadora.jsx – lógica de la calculadora (pantalla + teclado)

import { useState } from "react";
import { OPERACIONES, calcular } from "../services/calculadoraService";
import { convertirNumero, validarEntradas } from "../services/validaciones";
import Pantalla from "./Pantalla";
import Teclado from "./Teclado";
import Resultado from "./Resultado";
import MensajeError from "./MensajeError";

const TITULOS = {
  validacion: "⚠ Validación de entrada",
  operacion: "⚠ Operación no permitida",
  conexion: "✕ Error de conexión",
  servidor: "✕ Error del servidor",
};
const MAX_CARACTERES = 15;
const NO_NUMERICO_1 = "El Número 1 debe ser un valor numérico (por ejemplo 20 o 10.5).";

export default function Calculadora({ alCambiarEstado }) {
  const [actual, setActual] = useState("");          // número que se está escribiendo
  const [anterior, setAnterior] = useState(null);    // Número 1 (ya confirmado)
  const [operacion, setOperacion] = useState(null);  // operación elegida
  const [historial, setHistorial] = useState("");    // por ejemplo "20 + 5 ="
  const [hayResultado, setHayResultado] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const mostrarError = (mensaje, tipo = "validacion") => {
    setResultado(null);
    setError({ titulo: TITULOS[tipo], mensaje });
  };

  // ---------- escribir números ----------
  const escribir = (caracter) => {
    setError(null);
    let base = actual;
    if (hayResultado) {      // después de "=" un dígito empieza un número nuevo
      base = "";
      setHayResultado(false);
      setHistorial("");
    }
    if (caracter === ".") {
      if (base.includes(".") || base.includes(",")) return;
      if (base === "" || base === "-") base += "0";
    }
    if (base.length >= MAX_CARACTERES) return;
    setActual(base + caracter);
  };

  const cambiarTexto = (texto) => {   // escritura con el teclado del computador
    setError(null);
    setHayResultado(false);
    setActual(texto.slice(0, MAX_CARACTERES));
  };

  const borrar = () => setActual(actual.slice(0, -1));

  const cambiarSigno = () => {
    setError(null);
    setHayResultado(false);
    setActual(actual.startsWith("-") ? actual.slice(1) : "-" + actual);
  };

  const limpiar = () => {
    setActual("");
    setAnterior(null);
    setOperacion(null);
    setHistorial("");
    setHayResultado(false);
    setResultado(null);
    setError(null);
  };

  // ---------- llamar al Backend ----------
  // Valida los dos números, envía la petición y devuelve el resultado (o null si hubo error)
  const calcularPendiente = async () => {
    const v = validarEntradas(anterior, actual);
    if (!v.ok) {
      mostrarError(v.mensaje);
      return null;
    }
    setCargando(true);
    const r = await calcular(operacion, v.numero1, v.numero2);
    setCargando(false);
    alCambiarEstado?.(r.tipo !== "conexion");

    if (!r.ok) {
      mostrarError(r.mensaje, r.tipo);
      return null;
    }
    setResultado({
      operacion: r.data.operacion,
      numero1: r.data.numero1,
      numero2: r.data.numero2,
      resultado: r.data.resultado,
      simbolo: operacion.simbolo,
      status: r.status,
      json: r.body,
    });
    setHistorial(`${r.data.numero1} ${operacion.simbolo} ${r.data.numero2} =`);
    return r.data.resultado;
  };

  // ---------- elegir operación (+ − × ÷) ----------
  const elegirOperacion = async (op) => {
    setError(null);
    const texto = actual.trim();

    if (operacion && texto === "") {         // solo cambia la operación elegida
      setOperacion(op);
      return;
    }
    if (operacion) {                         // encadenar: 20 + 5 − ...
      const r = await calcularPendiente();
      if (r !== null) {
        setAnterior(String(r));
        setOperacion(op);
        setActual("");
        setHayResultado(false);
      }
      return;
    }

    // primer número
    const v = convertirNumero(texto);
    if (!v.ok) {
      mostrarError(v.motivo === "vacio" ? "Debes ingresar el Número 1." : NO_NUMERICO_1);
      return;
    }
    setAnterior(texto);
    setOperacion(op);
    setActual("");
    setHayResultado(false);
    setHistorial("");
  };

  // ---------- botón igual ----------
  const igual = async () => {
    setError(null);
    if (!operacion) {
      const texto = actual.trim();
      if (texto === "") return mostrarError("Debes ingresar el Número 1 y el Número 2.");
      if (!convertirNumero(texto).ok) return mostrarError(NO_NUMERICO_1);
      return mostrarError("Elige una operación: sumar, restar, multiplicar o dividir.");
    }
    const r = await calcularPendiente();
    if (r !== null) {
      setActual(String(r));
      setAnterior(null);
      setOperacion(null);
      setHayResultado(true);
    }
  };

  // ---------- teclas del computador dentro de la pantalla ----------
  const manejarTecla = (e) => {
    if (cargando) return;
    const porTecla = { "+": "suma", "*": "multiplicacion", "/": "division" };
    if (e.key === "Enter" || e.key === "=") {
      e.preventDefault();
      igual();
    } else if (porTecla[e.key] || (e.key === "-" && actual.trim() !== "")) {
      e.preventDefault();
      const id = e.key === "-" ? "resta" : porTecla[e.key];
      elegirOperacion(OPERACIONES.find((o) => o.id === id));
    } else if (e.key === "Escape") {
      limpiar();
    }
  };

  const expresion = operacion ? `${anterior} ${operacion.simbolo}` : historial;

  return (
    <>
      <section className="calculadora">
        <Pantalla expresion={expresion} valor={actual} onCambio={cambiarTexto} onTecla={manejarTecla} />
        <Teclado
          onDigito={escribir}
          onPunto={() => escribir(".")}
          onOperacion={elegirOperacion}
          onIgual={igual}
          onLimpiar={limpiar}
          onBorrar={borrar}
          onSigno={cambiarSigno}
          deshabilitado={cargando}
        />
        {cargando && <p className="cargando">Calculando...</p>}
      </section>

      <Resultado resultado={resultado} />
      <MensajeError error={error} />
    </>
  );
}
