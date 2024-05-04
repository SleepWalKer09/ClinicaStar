import httpx
import pytest
from fastapi import status
from datetime import datetime, timedelta

# Configuración del cliente de prueba
@pytest.fixture
def client():
    base_url = "http://localhost:8000"
    with httpx.Client(base_url=base_url) as client:
        yield client

@pytest.fixture
def create_usuario_fixture(client):
    usuario_data_create = {
        "nombre": "Juan",
        "apellido": "Perez",
        "email": "conchita@example.com",
        "rol": "Paciente",
        "phone": "555-1234",
        "password": "securePassword123",
        "edad": 30,
        "genero": "Masculino",
        "direccion": "Calle Falsa 123",
        "aseguradora": "Seguros XYZ",
        "alergias": "Ninguna"
    }
    response = client.post("/create_usuarios/", json=usuario_data_create)
    assert response.status_code == status.HTTP_200_OK, f"Error creating user: {response.text}"
    return response.json()["id_usuario"]

@pytest.fixture
def create_especialista_fixture(client):
    especialista_data_create = {
        "id_usuario": 7,
        "especialidad": "Cardiología",
        "description": "Especialista en enfermedades cardíacas y circulatorias"
    }
    response = client.post("/create_especialistas/", json=especialista_data_create)
    assert response.status_code == status.HTTP_200_OK
    return response.json()["id_especialista"]

@pytest.fixture
def create_cita_fixture(client, usuario_id, especialista_id):
    cita_data_create = {
        "id_paciente": 10,
        "id_especialista": 4,
        "fecha_hora": (datetime.now() + timedelta(days=1)).isoformat(),
        "estado": "Programada",
        "motivo": "Consulta inicial"
    }
    response = client.post("/create_citas/", json=cita_data_create)
    assert response.status_code == status.HTTP_200_OK
    return response.json()["id_cita"]

@pytest.fixture
def procedimiento_id(client):
    procedimiento_data_create = {
        "nombre": "Implantes Dentales",
        "description": "Colocación de implantes dentales de titanio en la mandíbula",
        "duration": 120,
        "costo": 2000
    }
    response = client.post("/create_procedimientos/", json=procedimiento_data_create)
    assert response.status_code == status.HTTP_200_OK
    return response.json()["id_procedimiento"]

@pytest.fixture
def historial_clinico_fixture(client, usuario_fixture, cita_fixture, especialista_fixture, procedimiento_fixture):
    historial_data = {
        "id_usuario": usuario_fixture,
        "id_cita": cita_fixture,
        "id_especialista": especialista_fixture,
        "id_procedimiento": procedimiento_fixture,
        "notas_consulta": "Consulta regular, sin complicaciones",
        "tratamiento_recomendado": "Continuar con tratamiento actual",
        "medicinas": "Aspirina 100mg",
        "recomendaciones_adicionales": "Revisión en 6 meses",
        "fecha_consulta": datetime.now().isoformat()
    }
    response = client.post("/historial_clinico/", json=historial_data)
    historial_id = response.json()["id_historial"]
    yield historial_id
    client.delete(f"/historial_clinico/{historial_id}")


@pytest.mark.workflow
def test_usuario_workflow(client, create_usuario_fixture):
    usuario_id = create_usuario_fixture
    test_read_usuario(client)
    test_update_usuario(client, usuario_id)
    test_delete_usuario(client, usuario_id)
    print("Flujo CRUD-usuario completado exitosamente")

def test_read_usuario(client):
    response = client.get(f"/read_usuarios/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()

# Test de actualización utilizando el usuario_id fixture
def test_update_usuario(client, usuario_id):
    usuario_data_update = {
        "nombre": "Juan Modificado",
        "apellido": "Perez",
        "email": "juan.perez@example.com",
        "rol": "Paciente",
        "phone": "555-4321",
        "password": "newSecurePassword123",
        "edad": 31,
        "genero": "Masculino",
        "direccion": "Calle Verdadera 321",
        "aseguradora": "Seguros ABC",
        "alergias": "Polen"
    }
    response = client.put(f"/update_usuarios/{usuario_id}", json=usuario_data_update)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["nombre"] == "Juan Modificado"

# Test de eliminación utilizando el usuario_id fixture
def test_delete_usuario(client, usuario_id):
    response = client.delete(f"/delete_usuarios/{usuario_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"ok": True}


#especialistas


@pytest.mark.workflow
def test_especialista_workflow(client, create_especialista_fixture):
    especialista_id = create_especialista_fixture
    test_read_especialistas(client)
    test_read_especialista(client, especialista_id)
    test_update_especialista(client, especialista_id)
    test_delete_especialista(client, especialista_id)


def test_read_especialistas(client):
    response = client.get("/read_especialistas/")
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

def test_read_especialista(client, especialista_id):
    response = client.get(f"/read_especialistas/{especialista_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id_especialista"] == especialista_id

def test_update_especialista(client, especialista_id):
    especialista_data_update = {
        "id_usuario": 7,
        "especialidad": "Cardiología Avanzada",
        "description": "Experto en cardiología intervencionista"
    }
    response = client.put(f"/update_especialista/{especialista_id}", json=especialista_data_update)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["especialidad"] == "Cardiología Avanzada"

def test_delete_especialista(client, especialista_id):
    response = client.delete(f"/delete_especialista/{especialista_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"ok": True}



#citas
@pytest.mark.workflow
def test_cita_workflow(client, create_cita_fixture):
    cita_id = create_cita_fixture
    test_read_cita(client, cita_id)
    test_update_cita(client, cita_id)
    test_delete_cita(client, cita_id)

def test_read_cita(client, cita_id):
    response = client.get(f"/read_citas/{cita_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id_cita"] == cita_id

def test_update_cita(client, cita_id):
    cita_data_update = {
        "id_paciente": 10,
        "id_especialista": 4, 
        "fecha_hora": (datetime.now() + timedelta(days=8)).isoformat(),
        "estado": "Cancelada",
        "motivo": "Imposibilidad de usuario para asistir"
    }
    response = client.put(f"/update_citas/{cita_id}", json=cita_data_update)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["estado"] == "Cancelada"

def test_delete_cita(client, cita_id):
    response = client.delete(f"/delete_citas/{cita_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"ok": True}

#procedimiento
def test_read_procedimientos(client):
    response = client.get("/read_procedimientos/")
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

def test_read_procedimiento(client, procedimiento_id):
    response = client.get(f"/read_procedimientos/{procedimiento_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id_procedimiento"] == procedimiento_id

def test_update_procedimiento(client, procedimiento_id):
    procedimiento_data_update = {
        "nombre": "Implantes Dentales Avanzados",
        "description": "Implantes dentales avanzados con materiales de última generación",
        "duration": 150,
        "costo": 2500
    }
    response = client.put(f"/update_procedimiento/{procedimiento_id}", json=procedimiento_data_update)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["nombre"] == "Implantes Dentales Avanzados"

def test_delete_procedimiento(client, procedimiento_id):
    response = client.delete(f"/delete_procedimiento/{procedimiento_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"ok": True}


#historial


@pytest.mark.workflow
def test_historial_clinico_workflow(client, historial_id):
    test_read_historial_clinico(client, historial_id)
    test_update_historial_clinico(client, historial_id)
    test_delete_historial_clinico(client, historial_id)


def test_update_historial_clinico(client, historial_id):
    historial_data_update = {
        "id_historial": historial_id,
        "id_cita": 22,  
        "id_usuario": 10,  
        "id_especialista": 2, 
        "id_procedimiento": 1,  
        "notas_consulta": "Revisión de seguimiento",
        "tratamiento_recomendado": "Modificar dosis de medicación",
        "medicinas": "Ibuprofeno, Acetaminofén",
        "recomendaciones_adicionales": "Prueba adicional de laboratorio",
        "fecha_consulta": (datetime.now() + timedelta(days=10)).isoformat()
    }
    response = client.put(f"/update_historial_clinico/{historial_id}", json=historial_data_update)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["notas_consulta"] == "Revisión de seguimiento"

def test_read_historiales_clinicos(client):
    usuario_id = 1  # Asumimos que este usuario ya existe
    response = client.get(f"/read_historiales_clinicos/{usuario_id}")
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json(), list)

def test_read_historial_clinico(client, historial_id):
    response = client.get(f"/read_historiales_clinicos/{historial_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id_historial"] == historial_id

def test_delete_historial_clinico(client, historial_id):
    response = client.delete(f"/delete_historial_clinico/{historial_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"ok": True}


