from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from main import app, get_db
from db.db_config import Base
import pytest

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

# Dependency override
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_usuario():
    response = client.post(
        "/usuarios/",
        json={"nombre": "Test", "apellido": "User", "email": "testuser@example.com", "password": "testpassword", "rol": "Usuario", "phone": "123456789"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert "id_usuario" in data

def test_login():
    # Asegúrate de crear primero un usuario para el login
    response = client.post(
        "/login",
        data={"username": "testuser@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_read_usuarios():
    response = client.get("/usuarios/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_read_usuario():
    # Asegúrate de crear un usuario antes de ejecutar esta prueba o utiliza un ID existente
    usuario_id = 1  # Cambiar según sea necesario
    response = client.get(f"/usuarios/{usuario_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id_usuario"] == usuario_id

def test_update_usuario():
    # Asegúrate de crear un usuario antes de ejecutar esta prueba o utiliza un ID existente
    usuario_id = 1  # Cambiar según sea necesario
    response = client.put(
        f"/usuarios/{usuario_id}",
        json={"nombre": "Nombre Actualizado", "password": "nuevacontraseña"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nombre"] == "Nombre Actualizado"

def test_delete_usuario():
    # Asegúrate de crear un usuario antes de ejecutar esta prueba o utiliza un ID existente
    usuario_id = 1  # Cambiar según sea necesario
    response = client.delete(f"/usuarios/{usuario_id}")
    assert response.status_code == 200
    assert response.json() == {"ok": True}

# Ejemplo para crear un especialista
def test_create_especialista():
    response = client.post(
        "/especialistas/",
        json={"id_usuario": 1, "especialidad": "Especialidad de prueba", "description": "Descripción de prueba"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["especialidad"] == "Especialidad de prueba"