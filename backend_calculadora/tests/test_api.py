# test_api.py – pruebas de los endpoints REST (capa presentation)

import pytest
from fastapi.testclient import TestClient

from presentation.webapicalculadora import app


@pytest.fixture
def client():
    return TestClient(app)


def test_estado_de_la_api(client):
    r = client.get("/")
    assert r.status_code == 200 and "funcionando" in r.json()["mensaje"]


def test_swagger_disponible(client):
    assert client.get("/docs").status_code == 200
    assert client.get("/openapi.json").status_code == 200


@pytest.mark.parametrize(
    "ruta, operacion, resultado",
    [
        ("suma", "Suma", 25),
        ("resta", "Resta", 15),
        ("multiplicacion", "Multiplicación", 100),
        ("division", "División", 4),
    ],
)
def test_las_cuatro_operaciones(client, ruta, operacion, resultado):
    r = client.post(f"/api/calculadora/{ruta}", json={"numero1": 20, "numero2": 5})
    assert r.status_code == 200
    assert r.json() == {"operacion": operacion, "numero1": 20, "numero2": 5, "resultado": resultado}


def test_numeros_negativos(client):
    r = client.post("/api/calculadora/suma", json={"numero1": -10, "numero2": 5})
    assert r.json()["resultado"] == -5


def test_numeros_decimales(client):
    r = client.post("/api/calculadora/suma", json={"numero1": 10.5, "numero2": 2.5})
    assert r.json() == {"operacion": "Suma", "numero1": 10.5, "numero2": 2.5, "resultado": 13}


def test_decimales_sin_error_de_punto_flotante(client):
    r = client.post("/api/calculadora/suma", json={"numero1": 0.1, "numero2": 0.2})
    assert r.json()["resultado"] == 0.3


def test_division_por_cero_responde_400(client):
    r = client.post("/api/calculadora/division", json={"numero1": 20, "numero2": 0})
    assert r.status_code == 400
    assert r.json() == {"detail": "No es posible dividir entre cero"}


def test_resultado_fuera_de_rango_responde_400(client):
    r = client.post("/api/calculadora/multiplicacion", json={"numero1": 1e308, "numero2": 10})
    assert r.status_code == 400


def test_cuerpo_vacio_responde_422(client):
    assert client.post("/api/calculadora/suma", json={}).status_code == 422


def test_falta_un_numero_responde_422(client):
    assert client.post("/api/calculadora/suma", json={"numero1": 20}).status_code == 422


@pytest.mark.parametrize("valor", ["abc", "20", True, None, [1]])
def test_datos_no_numericos_responden_422(client, valor):
    r = client.post("/api/calculadora/suma", json={"numero1": valor, "numero2": 5})
    assert r.status_code == 422


def test_cors_permite_el_frontend_react(client):
    r = client.get("/", headers={"Origin": "http://localhost:5173"})
    assert r.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_cors_no_permite_otros_origenes(client):
    r = client.get("/", headers={"Origin": "http://otro-sitio.com"})
    assert "access-control-allow-origin" not in r.headers
