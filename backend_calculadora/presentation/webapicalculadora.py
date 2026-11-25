# webapicalculadora.py – API REST de la calculadora

from dataclasses import asdict

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from application.calculadoraservice import CalculadoraService
from domain.excepciones import CalculadoraError
from infrastructure.config import ORIGENES_PERMITIDOS
from presentation.schemas import CalculoResponse, ErrorResponse, OperandosRequest

app = FastAPI(
    title="API CalculadoraWebAI",
    description="Calculadora básica: suma, resta, multiplicación y división de dos números.",
    version="1.0.0",
)

# CORS: permite que el Frontend React (puerto 5173) consuma esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGENES_PERMITIDOS,
    allow_methods=["*"],
    allow_headers=["*"],
)


def obtener_servicio() -> CalculadoraService:
    return CalculadoraService()


@app.exception_handler(CalculadoraError)
async def manejar_error_de_calculo(request: Request, exc: CalculadoraError):
    # División por cero o resultado fuera de rango -> 400 Bad Request
    return JSONResponse(status_code=400, content={"detail": str(exc)})


RESPUESTAS_ERROR = {
    400: {"model": ErrorResponse, "description": "Operación no permitida (por ejemplo, división por cero)"},
    422: {"description": "Datos de entrada no válidos (faltan campos o no son numéricos)"},
}


@app.get("/", summary="Estado de la API", tags=["Estado"])
async def inicio():
    return {"mensaje": "API CalculadoraWebAI funcionando"}


@app.post(
    "/api/calculadora/suma",
    response_model=CalculoResponse,
    summary="Sumar dos números",
    description="Suma numero1 + numero2.",
    tags=["Calculadora"],
    responses=RESPUESTAS_ERROR,
)
async def sumar(datos: OperandosRequest, servicio: CalculadoraService = Depends(obtener_servicio)):
    return asdict(servicio.sumar(datos.numero1, datos.numero2))


@app.post(
    "/api/calculadora/resta",
    response_model=CalculoResponse,
    summary="Restar dos números",
    description="Resta numero1 - numero2.",
    tags=["Calculadora"],
    responses=RESPUESTAS_ERROR,
)
async def restar(datos: OperandosRequest, servicio: CalculadoraService = Depends(obtener_servicio)):
    return asdict(servicio.restar(datos.numero1, datos.numero2))


@app.post(
    "/api/calculadora/multiplicacion",
    response_model=CalculoResponse,
    summary="Multiplicar dos números",
    description="Multiplica numero1 × numero2.",
    tags=["Calculadora"],
    responses=RESPUESTAS_ERROR,
)
async def multiplicar(datos: OperandosRequest, servicio: CalculadoraService = Depends(obtener_servicio)):
    return asdict(servicio.multiplicar(datos.numero1, datos.numero2))


@app.post(
    "/api/calculadora/division",
    response_model=CalculoResponse,
    summary="Dividir dos números",
    description="Divide numero1 ÷ numero2. Si numero2 es 0 responde 400.",
    tags=["Calculadora"],
    responses=RESPUESTAS_ERROR,
)
async def dividir(datos: OperandosRequest, servicio: CalculadoraService = Depends(obtener_servicio)):
    return asdict(servicio.dividir(datos.numero1, datos.numero2))
