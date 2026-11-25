# calculadoraservice.py – casos de uso de la calculadora

from domain import operaciones
from domain.calculo import Calculo
from domain.operaciones import Operacion, normalizar


class CalculadoraService:

    def sumar(self, numero1: float, numero2: float) -> Calculo:
        return self._ejecutar(Operacion.SUMA, operaciones.sumar, numero1, numero2)

    def restar(self, numero1: float, numero2: float) -> Calculo:
        return self._ejecutar(Operacion.RESTA, operaciones.restar, numero1, numero2)

    def multiplicar(self, numero1: float, numero2: float) -> Calculo:
        return self._ejecutar(Operacion.MULTIPLICACION, operaciones.multiplicar, numero1, numero2)

    def dividir(self, numero1: float, numero2: float) -> Calculo:
        return self._ejecutar(Operacion.DIVISION, operaciones.dividir, numero1, numero2)

    def _ejecutar(self, operacion: Operacion, funcion, numero1: float, numero2: float) -> Calculo:
        resultado = funcion(numero1, numero2)
        return Calculo(
            operacion=operacion.value,
            numero1=normalizar(numero1),
            numero2=normalizar(numero2),
            resultado=normalizar(resultado),
        )
