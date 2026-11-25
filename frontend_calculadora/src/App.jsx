// App.jsx – pantalla principal de la calculadora de GOTYStore

import { useEffect, useState } from "react";
import Calculadora from "./components/Calculadora";
import { API_URL, verificarEstado } from "./services/calculadoraService";

export default function App() {
  const [estado, setEstado] = useState("verificando");

  // Al abrir la página: comprobar si el Backend está encendido
  useEffect(() => {
    verificarEstado().then((ok) => setEstado(ok ? "conectado" : "desconectado"));
  }, []);

  const textoEstado = {
    verificando: "Verificando Backend...",
    conectado: "Backend conectado",
    desconectado: "Backend desconectado",
  }[estado];

  return (
    <div className="app">
      <header>
        <h1>🏆 GOTYStore</h1>
        <p className="subtitulo">Calculadora de precios</p>
        <div className={`estado estado-${estado}`}>
          <span className="punto" />
          {textoEstado}
          <small>{API_URL}</small>
        </div>
      </header>

      <main>
        <Calculadora alCambiarEstado={(ok) => setEstado(ok ? "conectado" : "desconectado")} />
      </main>

      <footer>CalculadoraWebAI · React + Vite + FastAPI</footer>
    </div>
  );
}
