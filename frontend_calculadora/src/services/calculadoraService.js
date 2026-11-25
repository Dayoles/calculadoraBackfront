// calculadoraService.js
// Centraliza las peticiones HTTP hacia el Backend FastAPI.

import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:7000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
  // Axios no lanza error por 400 o 422: los analizamos nosotros.
  validateStatus: () => true,
});

// Las cuatro operaciones y su endpoint en el Backend
export const OPERACIONES = [
  { id: "suma", boton: "Sumar", simbolo: "+", ruta: "/api/calculadora/suma" },
  { id: "resta", boton: "Restar", simbolo: "−", ruta: "/api/calculadora/resta" },
  { id: "multiplicacion", boton: "Multiplicar", simbolo: "×", ruta: "/api/calculadora/multiplicacion" },
  { id: "division", boton: "Dividir", simbolo: "÷", ruta: "/api/calculadora/division" },
];

// Obtiene un mensaje legible desde el cuerpo del error del Backend
function extraerMensaje(body) {
  const detalle = body?.detail;
  if (typeof detalle === "string") return detalle;
  if (Array.isArray(detalle)) {
    const campos = detalle.map((e) => e.loc?.[e.loc.length - 1]).filter(Boolean);
    return `Datos no válidos en: ${campos.join(", ") || "los campos enviados"}`;
  }
  return "Ocurrió un error inesperado en el Backend";
}

// POST /api/calculadora/{operacion}  con { numero1, numero2 }
export async function calcular(operacion, numero1, numero2) {
  try {
    const r = await api.post(operacion.ruta, { numero1, numero2 });
    if (r.status >= 200 && r.status < 300) {
      return { ok: true, status: r.status, data: r.data, body: r.data };
    }
    return {
      ok: false,
      status: r.status,
      tipo: r.status === 400 ? "operacion" : r.status === 422 ? "validacion" : "servidor",
      mensaje: extraerMensaje(r.data),
      body: r.data,
    };
  } catch (error) {
    // Sin respuesta: Backend apagado, sin red o tiempo agotado
    return {
      ok: false,
      status: 0,
      tipo: "conexion",
      mensaje: "No fue posible conectarse con el Backend",
      body: null,
    };
  }
}

// GET /  -> verifica que el Backend está encendido
export async function verificarEstado() {
  try {
    const r = await api.get("/");
    return r.status >= 200 && r.status < 300;
  } catch (error) {
    return false;
  }
}
