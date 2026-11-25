# schemas.py – contratos JSON de entrada y salida (Pydantic)

from typing import Union

from pydantic import BaseModel, ConfigDict, Field

Numero = Union[int, float]


class OperandosRequest(BaseModel):
    """Dos valores numéricos. Se rechazan textos, booleanos, NaN e infinito."""

    model_config = ConfigDict(
        json_schema_extra={"example": {"numero1": 20, "numero2": 5}}
    )

    numero1: float = Field(..., strict=True, allow_inf_nan=False, description="Primer número")
    numero2: float = Field(..., strict=True, allow_inf_nan=False, description="Segundo número")


class CalculoResponse(BaseModel):
    operacion: str
    numero1: Numero
    numero2: Numero
    resultado: Numero

    model_config = ConfigDict(
        json_schema_extra={
            "example": {"operacion": "Suma", "numero1": 20, "numero2": 5, "resultado": 25}
        }
    )


class ErrorResponse(BaseModel):
    detail: str

    model_config = ConfigDict(
        json_schema_extra={"example": {"detail": "No es posible dividir entre cero"}}
    )
