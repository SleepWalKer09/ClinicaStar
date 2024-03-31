from pydantic import BaseModel, EmailStr,SecretBytes,SecretStr, validator
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

#login
class Token(BaseModel):
    access_token: str
    token_type: str

# Esquema de Usuario
class UsuarioBase(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: EmailStr
    rol: Optional[str] = None
    phone: Optional[str] = None
    edad: Optional[int] = None 
    genero: Optional[str] = None
    direccion: Optional[str] = None
    aseguradora: Optional[str] = None
    alergias: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[EmailStr] = None
    rol: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    edad: Optional[int] = None
    genero: Optional[str] = None
    direccion: Optional[str] = None
    aseguradora: Optional[str] = None
    alergias: Optional[str] = None


class Usuario(UsuarioBase):
    id_usuario: int

    class Config:
        orm_mode = True

class UsuarioUpdate(UsuarioBase):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[EmailStr] = None
    rol: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    edad: Optional[int] = None
    genero: Optional[str] = None
    direccion: Optional[str] = None
    aseguradora: Optional[str] = None
    alergias: Optional[str] = None

# Esquema de Especialista
class EspecialistaBase(BaseModel):
    id_usuario: int
    especialidad: str
    description: Optional[str] = None

class EspecialistaCreate(EspecialistaBase):
    pass

class Especialista(EspecialistaBase):
    id_especialista: int
    especialidad: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

class EspecialistaUpdate(EspecialistaBase):
    especialidad: str
    description: Optional[str] = None



# Esquema de Cita
class CitaBase(BaseModel):
    id_paciente: int
    id_especialista: int
    fecha_hora: datetime
    estado: str
    motivo: Optional[str] = None

class CitaCreate(CitaBase):
    @validator('fecha_hora', pre=True)
    def parse_fecha_hora(cls, value):
        if value:
            return datetime.strptime(value, "%Y-%m-%dT%H:%M")
        return value

class CitaUpdate(CitaBase):
    id_paciente: Optional[int] = None
    id_especialista: Optional[int] = None
    fecha_hora: Optional[datetime] = None
    estado: Optional[str] = None
    motivo: Optional[str] = None

class Cita(CitaBase):
    id_cita: int

    class Config:
        orm_mode = True

# Esquema de Procedimiento
class ProcedimientoBase(BaseModel):
    nombre: str
    description: Optional[str] = None
    duration: int
    costo: int

class ProcedimientoUpdate(BaseModel):
    nombre: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    costo: Optional[int] = None

class ProcedimientoCreate(ProcedimientoBase):
    nombre: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    costo: Optional[int] = None

class Procedimiento(ProcedimientoBase):
    id_procedimiento: int

    class Config:
        orm_mode = True

# Esquema de Historial Clínico
class HistorialClinicoBase(BaseModel):
    # id_historial: int
    id_cita: int
    id_usuario: int
    id_especialista: int
    id_procedimiento: int
    notas_consulta: Optional[str] = None
    tratamiento_recomendado: Optional[str] = None
    medicinas: Optional[str] = None
    recomendaciones_adicionales: Optional[str] = None
    fecha_consulta: Optional[datetime] = None

class HistorialClinicoCreate(BaseModel):
    id_cita: int
    id_usuario: int
    id_especialista: int
    id_procedimiento: int
    notas_consulta: Optional[str] = None
    tratamiento_recomendado: Optional[str] = None
    medicinas: Optional[str] = None
    recomendaciones_adicionales: Optional[str] = None
    fecha_consulta: Optional[datetime] = None

class HistorialClinicoUpdate(HistorialClinicoBase):
    id_historial: int
    id_cita: int
    id_usuario: int
    id_especialista: int
    id_procedimiento: int
    notas_consulta: Optional[str] = None
    tratamiento_recomendado: Optional[str] = None
    medicinas: Optional[str] = None
    recomendaciones_adicionales: Optional[str] = None
    fecha_consulta: Optional[datetime] = None

class HistorialClinico(HistorialClinicoBase):
    id_historial: int

    class Config:
        orm_mode = True
