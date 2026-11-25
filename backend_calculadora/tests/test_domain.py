# test_domain.py – pruebas de las reglas de negocio (capa domain)

import pytest

from domain import operaciones
from domain.excepciones import DivisionPorCeroError, ResultadoFueraDeRangoError
from domain.operaciones import normalizar


@pytest.mark.parametrize(
    "funcion, a, b, esperado",
    [
        (operaciones.sumar, 20, 5, 25),
        (operaciones.restar, 20, 5, 15),
        (operaciones.multiplicar, 20, 5, 100),
        (operaciones.dividir, 20, 5, 4),
        (operaciones.sumar, -10, 5, -5),
        (operaciones.sumar, 10.5, 2.5, 13),
        (operaciones.restar, 5, 20, -15),
        (operaciones.multiplicar, -4, 2.5, -10),
        (operaciones.dividir, 1, 4, 0.25),
    ],
)
def test_operaciones_basicas(funcion, a, b, esperado):
    assert funcion(a, b) == esperado


def test_division_por_cero_lanza_error():
    with pytest.raises(DivisionPorCeroError):
        operaciones.dividir(20, 0)


def test_division_por_cero_negativo_tambien_lanza_error():
    with pytest.raises(DivisionPorCeroError):
        operaciones.dividir(20, -0.0)


@pytest.mark.parametrize("funcion", [operaciones.sumar, operaciones.multiplicar])
def test_resultado_fuera_de_rango_lanza_error(funcion):
    with pytest.raises(ResultadoFueraDeRangoError):
        funcion(1e308, 1e308)


def test_normalizar_enteros_y_decimales():
    assert normalizar(20.0) == 20 and isinstance(normalizar(20.0), int)
    assert normalizar(0.1 + 0.2) == 0.3
    assert normalizar(1 / 3) == 0.3333333333
