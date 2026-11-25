// validaciones.js – validación de los campos antes de llamar al Backend

// Convierte el texto en número. Acepta coma o punto decimal (10,5 o 10.5)
export function convertirNumero(texto) {
  const limpio = String(texto).trim().replace(",", ".");
  if (limpio === "") return { ok: false, motivo: "vacio" };
  if (!/^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(limpio)) return { ok: false, motivo: "noNumerico" };
  const valor = Number(limpio);
  if (!Number.isFinite(valor)) return { ok: false, motivo: "noNumerico" };
  return { ok: true, valor };
}

// Valida los dos campos y devuelve los números o el mensaje de error
export function validarEntradas(texto1, texto2) {
  const a = convertirNumero(texto1);
  const b = convertirNumero(texto2);

  if (a.motivo === "vacio" && b.motivo === "vacio") {
    return { ok: false, mensaje: "Debes ingresar el Número 1 y el Número 2." };
  }
  if (a.motivo === "vacio") return { ok: false, mensaje: "Debes ingresar el Número 1." };
  if (b.motivo === "vacio") return { ok: false, mensaje: "Debes ingresar el Número 2." };
  if (a.motivo === "noNumerico") {
    return { ok: false, mensaje: "El Número 1 debe ser un valor numérico (por ejemplo 20 o 10.5)." };
  }
  if (b.motivo === "noNumerico") {
    return { ok: false, mensaje: "El Número 2 debe ser un valor numérico (por ejemplo 20 o 10.5)." };
  }
  return { ok: true, numero1: a.valor, numero2: b.valor };
}
