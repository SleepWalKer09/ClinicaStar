from fastapi import FastAPI, Depends, HTTPException, status,Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List
from sqlalchemy.orm import Session
from db_config import SessionLocal, engine, Base
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware

import crud, schemas, config

Base.metadata.create_all(bind=engine)

app = FastAPI()
origins = [
    "http://localhost:3000",
    "https://SleepWalKer09.github.io"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

# Dependency to get the database session.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/ClinicaStar/login", response_model=schemas.Token, tags=["Login"])
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    # Ahora incluimos el ID del usuario y el rol en el token
    access_token = config.create_access_token(
        data={"sub": str(user.id_usuario), "role": user.rol},  # Convertimos el ID a str para asegurarnos de que sea JSON serializable
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.rol}


# CRUD para Usuarios
@app.post("/ClinicaStar/create_usuarios/", response_model=schemas.Usuario, tags=["Usuarios"])
def create_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = crud.get_usuario_by_email(db, email=usuario.email)
    if db_usuario:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_usuario(db=db, usuario=usuario)

@app.get("/ClinicaStar/read_usuarios/", response_model=List[schemas.Usuario], tags=["Usuarios"])
def read_usuarios(db: Session = Depends(get_db)):
    usuarios = crud.get_usuarios(db)
    return usuarios

@app.get("/ClinicaStar/read_usuarios/{usuario_id}", response_model=schemas.Usuario, tags=["Usuarios"])
def read_usuario(usuario_id: int, db: Session = Depends(get_db)):
    db_usuario = crud.get_usuario(db, usuario_id=usuario_id)
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_usuario

@app.put("/ClinicaStar/update_usuarios/{usuario_id}", response_model=schemas.Usuario, tags=["Usuarios"])
def update_usuario(usuario_id: int, usuario: schemas.UsuarioUpdate, db: Session = Depends(get_db)):
    return crud.update_usuario(db=db, usuario_id=usuario_id, usuario=usuario)

@app.delete("/ClinicaStar/delete_usuarios/{usuario_id}", tags=["Usuarios"])
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    crud.delete_usuario(db=db, usuario_id=usuario_id)
    return {"ok": True}


# CRUD para Especialistas
@app.post("/ClinicaStar/create_especialistas/", response_model=schemas.Especialista, tags=["Especialista"])
def create_especialista(especialista: schemas.EspecialistaCreate, db: Session = Depends(get_db)):
    return crud.create_especialista(db=db, especialista=especialista)

@app.get("/ClinicaStar/read_especialistas/", response_model=List[schemas.Especialista], tags=["Especialista"])
def read_especialistas(db: Session = Depends(get_db)):
    especialistas = crud.get_especialistas(db)
    return especialistas

@app.get("/ClinicaStar/read_especialistas/{especialista_id}", response_model=schemas.Especialista, tags=["Especialista"])
def read_especialista(especialista_id: int, db: Session = Depends(get_db)):
    db_especialista = crud.get_especialista(db, especialista_id=especialista_id)
    if db_especialista is None:
        raise HTTPException(status_code=404, detail="Especialista no encontrado")
    return db_especialista

@app.put("/ClinicaStar/update_especialista/{especialista_id}", response_model=schemas.Especialista, tags=["Especialista"])
def update_especialista(especialista_id: int, especialista: schemas.EspecialistaUpdate, db: Session = Depends(get_db)):
    return crud.update_especialista(db=db, especialista_id=especialista_id, especialista=especialista)

@app.delete("/ClinicaStar/delete_especialista/{especialista_id}", tags=["Especialista"])
def delete_especialista(especialista_id: int, db: Session = Depends(get_db)):
    crud.delete_especialista(db=db, especialista_id=especialista_id)
    return {"ok": True}

# CRUD para Citas
@app.post("/ClinicaStar/create_citas/", response_model=schemas.Cita, tags=["Citas"])
def create_cita(cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    return crud.create_cita(db=db, cita=cita)

@app.get("/ClinicaStar/read_citas_usuario/", response_model=List[schemas.Cita], tags=["Citas"])
def read_citas(usuario_id: int, rol: str = Query("Paciente"), db: Session = Depends(get_db)):

    print(f"usuario_id: {usuario_id}.... rol:{rol}")
    citas = crud.get_citas_por_usuario(db, usuario_id=usuario_id, rol=rol)
    return citas

@app.get("/ClinicaStar/read_citas/{cita_id}", response_model=schemas.Cita, tags=["Citas"])
def read_cita(cita_id: int, db: Session = Depends(get_db)):
    db_cita = crud.get_cita(db, cita_id=cita_id)
    if db_cita is None:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return db_cita

@app.put("/ClinicaStar/update_citas/{cita_id}", response_model=schemas.Cita, tags=["Citas"])
def update_cita(cita_id: int, cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    return crud.update_cita(db=db, cita_id=cita_id, cita=cita)

@app.delete("/ClinicaStar/delete_citas/{cita_id}", tags=["Citas"])
def delete_cita(cita_id: int, db: Session = Depends(get_db)):
    crud.delete_cita(db=db, cita_id=cita_id)
    return {"ok": True}


# CRUD para Procedimientos
@app.post("/ClinicaStar/create_procedimientos/", response_model=schemas.Procedimiento, tags=["Procedimiento"])
def create_procedimiento(procedimiento: schemas.ProcedimientoCreate, db: Session = Depends(get_db)):
    return crud.create_procedimiento(db=db, procedimiento=procedimiento)

@app.get("/ClinicaStar/read_procedimientos/", response_model=List[schemas.Procedimiento], tags=["Procedimiento"])
def read_procedimientos(db: Session = Depends(get_db)):
    procedimientos = crud.get_procedimientos(db)
    return procedimientos

@app.get("/ClinicaStar/read_procedimientos/{procedimiento_id}", response_model=schemas.Procedimiento, tags=["Procedimiento"])
def read_procedimiento(procedimiento_id: int, db: Session = Depends(get_db)):
    db_procedimiento = crud.get_procedimiento(db, procedimiento_id=procedimiento_id)
    if db_procedimiento is None:
        raise HTTPException(status_code=404, detail="Procedimiento no encontrado")
    return db_procedimiento

@app.put("/ClinicaStar/update_procedimiento/{procedimiento_id}", response_model=schemas.Procedimiento, tags=["Procedimiento"])
def update_procedimiento(procedimiento_id: int, procedimiento: schemas.ProcedimientoUpdate, db: Session = Depends(get_db)):
    return crud.update_procedimiento(db=db, procedimiento_id=procedimiento_id, procedimiento=procedimiento)

@app.delete("/ClinicaStar/delete_procedimiento/{procedimiento_id}", tags=["Procedimiento"])
def delete_procedimiento(procedimiento_id: int, db: Session = Depends(get_db)):
    crud.delete_procedimiento(db=db, procedimiento_id=procedimiento_id)
    return {"ok": True}

#endpoints historial
@app.post("/ClinicaStar/create_historial_clinico/", response_model=schemas.HistorialClinico, tags=["Historial"])
def create_historial_clinico(historial: schemas.HistorialClinicoCreate, db: Session = Depends(get_db)):
    return crud.create_HistorialClinico(db=db, historial=historial)

@app.get("/ClinicaStar/read_historiales_clinicos/{usuario_id}", response_model=List[schemas.HistorialClinico], tags=["Historial"])
def read_historiales_clinicos(usuario_id: int, db: Session = Depends(get_db)):
    db_historiales = crud.get_historiales_clinicos_por_usuario(db, usuario_id)
    if not db_historiales:
        raise HTTPException(status_code=404, detail=f"No se encontraron historiales clínicos para el usuario {usuario_id}")
    return db_historiales

@app.put("/ClinicaStar/update_historial_clinico/{historial_id}", response_model=schemas.HistorialClinicoUpdate, tags=["Historial"])
def update_historial_clinico(historial_id: int, historial: schemas.HistorialClinicoUpdate, db: Session = Depends(get_db)):
    return crud.update_HistorialClinico(db=db, historial_id=historial_id, historial=historial)

@app.delete("/ClinicaStar/delete_historial_clinico/{historial_id}", tags=["Historial"])
def delete_historial_clinico(historial_id: int, db: Session = Depends(get_db)):
    success = crud.delete_HistorialClinico(db=db, HistorialClinico_id=historial_id)
    if not success:
        raise HTTPException(status_code=404, detail="Historial Clínico no encontrado")
    return {"ok": True}
