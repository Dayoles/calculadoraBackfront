# excepciones.py – errores propios del dominio de la calculadora


class CalculadoraError(Exception):
    """Error base de la calculadora."""


class DivisionPorCeroError(CalculadoraError):
    """Se intentó dividir entre cero."""


class ResultadoFueraDeRangoError(CalculadoraError):
    """El resultado es demasiado grande o no es un número válido."""
