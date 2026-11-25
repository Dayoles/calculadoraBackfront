# operaciones.py – reglas de negocio puras (sin FastAPI ni Pydantic)

import math
from enum import Enum

from domain.excepciones import DivisionPorCeroError, ResultadoFueraDeRangoError

DECIMALES = 10          # los resultados se redondean a 10 decimales
LIMITE_ENTERO = 1e15    # por debajo de este valor, 20.0 se muestra como 20


class Operacion(str, Enum):
    SUMA = "Suma"
    RESTA = "Resta"
    MULTIPLICACION = "Multiplicación"
    DIVISION = "División"


def normalizar(valor: float):
    """Redondea el valor y lo devuelve como entero cuando no tiene decimales
    (20.0 -> 20, 0.30000000000000004 -> 0.3)."""
    valor = round(valor, DECIMALES)
    if float(valor).is_integer() and abs(valor) < LIMITE_ENTERO:
        return int(valor)
    return valor


def _validar_resultado(resultado: float) -> float:
    if math.isnan(resultado) or math.isinf(resultado):
        raise ResultadoFueraDeRangoError("El resultado está fuera del rango permitido")
    return resultado


def sumar(a: float, b: float) -> float:
    return _validar_resultado(a + b)


def restar(a: float, b: float) -> float:
    return _validar_resultado(a - b)


def multiplicar(a: float, b: float) -> float:
    return _validar_resultado(a * b)


def dividir(a: float, b: float) -> float:
    if b == 0:
        raise DivisionPorCeroError("No es posible dividir entre cero")
    try:
        return _validar_resultado(a / b)
    except OverflowError:
        raise ResultadoFueraDeRangoError("El resultado está fuera del rango permitido")
