from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime,DECIMAL
from sqlalchemy.orm import relationship
from db_config import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    apellido = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    rol = Column(String)
    phone = Column(String)
    edad = Column(Integer) 
    genero = Column(String)
    direccion = Column(String)
    aseguradora = Column(String)
    alergias = Column(String)
    
    # Relaciones
    citas = relationship("Cita", back_populates="paciente")
    especialista = relationship("Especialista", back_populates="usuario", uselist=False)
    historiales_clinicos = relationship("HistorialClinico", back_populates="paciente")

class Especialista(Base):
    __tablename__ = "especialistas"
    id_especialista = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))
    especialidad = Column(String)
    description = Column(String)

    # Relaciones
    usuario = relationship("Usuario", back_populates="especialista")
    citas = relationship("Cita", back_populates="especialista")
    historiales_clinicos = relationship("HistorialClinico", back_populates="especialista")

class Cita(Base):
    __tablename__ = "citas"
    id_cita =  Column(Integer, primary_key=True, index=True)
    id_paciente = Column(Integer, ForeignKey("usuarios.id_usuario"))
    id_especialista = Column(Integer, ForeignKey("especialistas.id_especialista"))
    fecha_hora = Column(DateTime)
    estado = Column(String)
    motivo = Column(String)

    paciente = relationship("Usuario", back_populates="citas")
    especialista = relationship("Especialista", back_populates="citas")
    historial_clinico = relationship("HistorialClinico", back_populates="cita", uselist=False)
    
class Procedimiento(Base):
    __tablename__ = "procedimientos"
    id_procedimiento = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    description = Column(String)
    duration = Column(Integer) 
    costo = Column(Integer) 
    historiales_clinicos = relationship("HistorialClinico", back_populates="procedimiento")

class HistorialClinico(Base):
    __tablename__ = "historial_clinico"
    id_historial = Column(Integer, primary_key=True, index=True)
    id_cita = Column(Integer, ForeignKey("citas.id_cita"))
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))
    id_especialista = Column(Integer, ForeignKey("especialistas.id_especialista"))
    id_procedimiento = Column(Integer, ForeignKey("procedimientos.id_procedimiento"))
    notas_consulta = Column(String)
    tratamiento_recomendado = Column(String)
    medicinas = Column(String)
    recomendaciones_adicionales = Column(String)
    fecha_consulta = Column(DateTime)
    
    cita = relationship("Cita", back_populates="historial_clinico")
    paciente = relationship("Usuario", back_populates="historiales_clinicos")
    especialista = relationship("Especialista", back_populates="historiales_clinicos")
    procedimiento = relationship("Procedimiento", back_populates="historiales_clinicos")



# class Citas_Tratamientos(Base):
#     __tablename__ = "citas_tratamientos"
#     id_cita = Column(Integer, ForeignKey("citas.id_cita"), primary_key=True)
#     id_tratamiento = Column(Integer, ForeignKey("tratamientos.id_tratamiento"), primary_key=True)
