# CalculadoraWebAI – Laboratorio 4 (IA, Ingeniería de Prompts y Vibe Coding)

Calculadora web visual (pantalla y teclado, estilo GOTYStore; suma, resta, multiplicación y división) generada con Vibe Coding a partir de los prompts de la carpeta `prompts/`.

```
CalculadoraWebAI_Proyecto/
├── prompts/               6 archivos: inicial, refinamiento y refinado (backend y frontend)
├── backend_calculadora/   Python + FastAPI, arquitectura ONION, pruebas pytest
└── frontend_calculadora/  React + Vite + Axios
```

## 1. Backend (puerto 7000)
```
cd backend_calculadora
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pytest                 (40 pruebas)
python main.py
```
Swagger: http://127.0.0.1:7000/docs

## 2. Frontend (puerto 5173) – en otra terminal
```
cd frontend_calculadora
npm install
npm run dev
```
Aplicación: http://localhost:5173

Requisitos: Python 3.12+ y Node.js 22 LTS (mínimo 20.19).
Si PowerShell bloquea los scripts: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
