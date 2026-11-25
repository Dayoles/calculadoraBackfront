# calculo.py – entidad del dominio

from dataclasses import dataclass
from typing import Union

Numero = Union[int, float]


@dataclass(frozen=True)
class Calculo:
    """Resultado de una operación: qué se hizo, con qué valores y qué dio."""

    operacion: str
    numero1: Numero
    numero2: Numero
    resultado: Numero
