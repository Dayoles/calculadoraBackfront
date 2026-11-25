# test_service.py – pruebas de los casos de uso (capa application)

import pytest

from application.calculadoraservice import CalculadoraService
from domain.excepciones import DivisionPorCeroError


@pytest.fixture
def servicio():
    return CalculadoraService()


def test_sumar_devuelve_el_calculo_completo(servicio):
    c = servicio.sumar(20, 5)
    assert (c.operacion, c.numero1, c.numero2, c.resultado) == ("Suma", 20, 5, 25)


def test_restar(servicio):
    assert servicio.restar(20, 5).resultado == 15 and servicio.restar(20, 5).operacion == "Resta"


def test_multiplicar(servicio):
    assert servicio.multiplicar(20, 5).resultado == 100
    assert servicio.multiplicar(20, 5).operacion == "Multiplicación"


def test_dividir(servicio):
    assert servicio.dividir(20, 5).resultado == 4
    assert servicio.dividir(20, 5).operacion == "División"


def test_decimales_se_conservan(servicio):
    c = servicio.sumar(10.5, 2.5)
    assert c.numero1 == 10.5 and c.resultado == 13


def test_dividir_entre_cero_lanza_error(servicio):
    with pytest.raises(DivisionPorCeroError):
        servicio.dividir(20, 0)
