from sqlalchemy.orm import Session
from sqlalchemy import update
from config import verify_password,get_password_hash

import bcrypt
import models, schemas

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

# Funciones CRUD para Usuarios
def get_usuario_by_email(db: Session, email: str):
    return db.query(models.Usuario).filter(models.Usuario.email == email).first()

def create_usuario(db: Session, usuario: schemas.UsuarioCreate):
    hashed_password = get_password_hash(usuario.password)  # Hashea la contraseña correctamente
    db_usuario = models.Usuario(
        nombre=usuario.nombre, 
        apellido=usuario.apellido,
        email=usuario.email, 
        password=hashed_password,
        rol=usuario.rol, 
        phone=usuario.phone,
        edad=usuario.edad,  # Asegúrate de añadir los campos faltantes
        genero=usuario.genero,
        direccion=usuario.direccion,
        aseguradora=usuario.aseguradora,
        alergias=usuario.alergias,
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

def get_usuarios(db: Session):
    return db.query(models.Usuario).all()

def get_usuario(db: Session, usuario_id: int):
    return db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()

def update_usuario(db: Session, usuario_id: int, usuario: schemas.UsuarioUpdate):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if not db_usuario:
        raise Exception("Usuario no existente") 
    usuario_data = usuario.dict(exclude_unset=True)
    for key, value in usuario_data.items():
        if key == "password":
            hashed_password = hash_password(value)  # Aquí se hashea la contraseña
            setattr(db_usuario, key, hashed_password)
        else:
            setattr(db_usuario, key, value)
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

def delete_usuario(db: Session, usuario_id: int):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if db_usuario:
        db.delete(db_usuario)
        db.commit()
        return True
    return False




# Funciones CRUD para Especialistas
def get_especialista(db: Session, especialista_id: int):
    return db.query(models.Especialista).filter(models.Especialista.id_especialista == especialista_id).first()

def create_especialista(db: Session, especialista: schemas.EspecialistaCreate):
    db_especialista = models.Especialista(**especialista.dict())
    db.add(db_especialista)
    db.commit()
    db.refresh(db_especialista)
    return db_especialista

def get_especialistas(db):
    return db.query(models.Especialista).all()

def update_especialista(db: Session, especialista_id: int, especialista: schemas.EspecialistaUpdate):
    db_especialista = db.query(models.Especialista).filter(models.Especialista.id_especialista == especialista_id).first()
    if db_especialista is None:
        raise Exception("Especialista no existente") 
    update_data = especialista.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_especialista, key, value)
    db.commit()
    db.refresh(db_especialista)
    return db_especialista

def delete_especialista(db: Session, especialista_id: int):
    db_especialista = get_especialista(db, especialista_id)
    if db_especialista:
        db.delete(db_especialista)
        db.commit()
        return True
    return False


# Funciones CRUD para Citas
def get_cita(db: Session, cita_id: int):
    return db.query(models.Cita).filter(models.Cita.id_cita == cita_id).first()

def create_cita(db: Session, cita: schemas.CitaCreate):
    db_cita = models.Cita(**cita.dict())
    db.add(db_cita)
    db.commit()
    db.refresh(db_cita)
    return db_cita

def get_citas_por_usuario(db: Session, usuario_id: int, rol: str):
    if rol.lower() == "paciente":
        return db.query(models.Cita).filter(models.Cita.id_paciente == usuario_id).all()
    elif rol.lower() == "especialista":
        # Primero, encuentra el id_especialista que corresponde al id_usuario dado
        especialista = db.query(models.Especialista).filter(models.Especialista.id_usuario == usuario_id).first()
        if especialista:
            return db.query(models.Cita).filter(models.Cita.id_especialista == especialista.id_especialista).all()
        else:   
            return []
    else:
        return []
    
def update_cita(db: Session, cita_id: int, cita: schemas.CitaUpdate):
    db_cita = db.query(models.Cita).filter(models.Cita.id_cita == cita_id).first()
    if db_cita is None:
        raise Exception("Cita no existente") 
    update_data = cita.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_cita, key, value)
    db.commit()
    db.refresh(db_cita)
    return db_cita

def delete_cita(db: Session, cita_id: int):
    db_cita = get_cita(db, cita_id)
    if db_cita:
        db.delete(db_cita)
        db.commit()
        return True
    return False


# Funciones CRUD para Procedimientos
def get_procedimiento(db: Session, procedimiento_id: int):
    return db.query(models.Procedimiento).filter(models.Procedimiento.id_procedimiento == procedimiento_id).first()

def create_procedimiento(db: Session, procedimiento: schemas.ProcedimientoCreate):
    db_procedimiento = models.Procedimiento(**procedimiento.dict())
    db.add(db_procedimiento)
    db.commit()
    db.refresh(db_procedimiento)
    return db_procedimiento

def get_procedimientos(db: Session):
    return db.query(models.Procedimiento).all()

def update_procedimiento(db: Session, procedimiento_id: int, procedimiento: schemas.ProcedimientoCreate):
    db.query(models.Procedimiento).filter(models.Procedimiento.id_procedimiento == procedimiento_id).update(procedimiento.dict())
    db.commit()
    return get_procedimiento(db, procedimiento_id)

def update_procedimiento(db: Session, procedimiento_id: int, procedimiento: schemas.ProcedimientoUpdate):
    db_procedimiento = db.query(models.Procedimiento).filter(models.Procedimiento.id_procedimiento == procedimiento_id).first()
    if db_procedimiento is None:
        raise Exception("Procedimiento no existente") 
    update_data = procedimiento.dict(exclude_unset=True)
    if 'costo' in update_data and update_data['costo'] == 0:
        raise Exception(status_code=400, detail="El costo no puede ser 0")
    if 'duration' in update_data and update_data['duration'] <= 0:
        raise Exception(status_code=400, detail="La duración debe ser mayor a 0")
    if 'nombre' in update_data and not update_data['nombre']:
        raise Exception(status_code=400, detail="El nombre no puede estar vacío")

    for key, value in update_data.items():
        setattr(db_procedimiento, key, value)
    db.commit()
    db.refresh(db_procedimiento)
    return db_procedimiento

def delete_procedimiento(db: Session, procedimiento_id: int):
    db_procedimiento = get_procedimiento(db, procedimiento_id)
    if db_procedimiento:
        db.delete(db_procedimiento)
        db.commit()
        return True
    return False




# Funciones CRUD para Historial Clínico
def get_historiales_clinicos_por_usuario(db: Session, usuario_id: int):
    return db.query(models.HistorialClinico).filter(models.HistorialClinico.id_usuario == usuario_id).all()

def create_HistorialClinico(db: Session, historial: schemas.HistorialClinicoCreate):
    db_historial = models.HistorialClinico(**historial.dict())
    db.add(db_historial)
    db.commit()
    db.refresh(db_historial)
    return db_historial

def update_HistorialClinico(db: Session, historial_id: int, historial: schemas.HistorialClinicoUpdate):
    db_historial = db.query(models.HistorialClinico).filter(models.HistorialClinico.id_historial == historial_id).first()
    if db_historial is None:
        raise Exception("Historial Clinico no existente") 
    update_data = historial.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_historial, key, value)
    db.commit()
    db.refresh(db_historial)
    return db_historial

def delete_HistorialClinico(db: Session, HistorialClinico_id: int):
    db_HistorialClinico = get_HistorialClinico(db, HistorialClinico_id)
    if db_HistorialClinico:
        db.delete(db_HistorialClinico)
        db.commit()
        return True
    return False
def get_HistorialClinico(db: Session, HistorialClinico_id):
    return db.query(models.HistorialClinico).filter(models.HistorialClinico.id_historial == HistorialClinico_id).first()
