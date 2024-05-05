import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import {jwtDecode} from 'jwt-decode';
import { Modal, Button, Form } from 'react-bootstrap';


const AppointmentDetailsModal = ({ citaId, onClose, onCitaUpdated, onCitaDeleted }) => {
    const [citaData, setCitaData] = useState({
        id_paciente: '',
        id_especialista: '',
        fecha_hora: '',
        estado: '',
        motivo: '',
    });
    const [procedimientos, setProcedimientos] = useState([]);
    const [historialData, setHistorialData] = useState({
        id_procedimiento: '',
        notas_consulta: '',
        tratamiento_recomendado: '',
        medicinas: '',
        recomendaciones_adicionales: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUserRole(decoded.role);
        }

        const fetchCitaDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/ClinicaStar/read_citas/${citaId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formattedFechaHora = format(parseISO(response.data.fecha_hora), "yyyy-MM-dd'T'HH:mm");
                setCitaData({ ...response.data, fecha_hora: formattedFechaHora });
            } catch (err) {
                setError('Error al cargar los detalles de la cita.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };


        const fetchProcedimientos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/ClinicaStar/read_procedimientos/');
                setProcedimientos(response.data);
            } catch (error) {
                console.error('Error al cargar procedimientos:', error);
            }
        };

        fetchCitaDetails();
        fetchProcedimientos();
    }, [citaId]);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleStateChange = (e) => {
        const { name, value } = e.target;
        setCitaData(prevState => ({ ...prevState, [name]: value }));
        // Manejar el caso especial para 'estado', donde puede necesitarse resetear historialData
        if (name === 'estado' && value !== 'completada') {
            setHistorialData({
                id_procedimiento: '',
                notas_consulta: '',
                tratamiento_recomendado: '',
                medicinas: '',
                recomendaciones_adicionales: ''
            });
        }
    };

    const handleUpdate = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:8000/ClinicaStar/update_citas/${citaId}`, citaData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (response.status === 200) {
                onCitaUpdated(response.data);  // Actualiza el estado en CalendarComponent
                setIsEditing(false);
                setSuccessMessage('La cita ha sido actualizada con éxito.');
                setTimeout(() => {
                    setSuccessMessage('');
                    onClose();
                }, 3000);
            }
        } catch (err) {
            console.error("Error al actualizar la cita:", err);
            setError('Error al actualizar la cita.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8000/ClinicaStar/delete_citas/${citaId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            onCitaDeleted(citaId);
            setSuccessMessage('La cita ha sido eliminada con éxito.');
            setTimeout(() => {
                setSuccessMessage('');
                onClose();
            }, 3000); 
        } catch (err) {
            console.error("Error al eliminar la cita:", err);
            setError('Error al eliminar la cita.');
        } finally {
            setLoading(false);
        }
    };

    const handleCrearHistorialClinico = async () => {
        
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        };
    
        const historialClinicoData = {
            id_cita: citaId,
            id_usuario: citaData.id_paciente,
            id_especialista: citaData.id_especialista,
            id_procedimiento: historialData.id_procedimiento,
            notas_consulta: historialData.notas_consulta,
            tratamiento_recomendado: historialData.tratamiento_recomendado,
            medicinas: historialData.medicinas,
            recomendaciones_adicionales: historialData.recomendaciones_adicionales,
            fecha_consulta: new Date(citaData.fecha_hora)
        };
        if (!historialData.id_procedimiento) {
            setError("Por favor, seleccione un procedimiento.");
            return;
        }
    
        try {
            const response = await axios.post(
                `http://localhost:8000/ClinicaStar/create_historial_clinico/`,historialClinicoData,
                { headers }
            );
    
            if (response.data) {
                setSuccessMessage('Historial clínico creado con éxito.');

            }
        } catch (error) {
            console.error('Error al crear historial clínico:', error);
            setError('Error al crear historial clínico. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <Modal show={true} onHide={onClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Detalles de la cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Fecha y hora</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        name="fecha_hora"
                        value={citaData.fecha_hora}
                        onChange={handleStateChange}  //handleUpdate
                        disabled={!isEditing}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                        name="estado"
                        value={citaData.estado}
                        onChange={handleStateChange}
                        disabled={!isEditing || (userRole === 'Paciente' && citaData.estado === 'completada')}
                    >
                        <option value="programada">Programada</option>
                        {userRole === 'Especialista' && <option value="completada">Completada</option>}
                        <option value="cancelada">Cancelada</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Motivo</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="motivo"
                        value={citaData.motivo}
                        onChange={handleStateChange}//handleUpdate
                        disabled={!isEditing}
                    />
                </Form.Group>
            </Form>
            {citaData.estado === 'completada' && userRole === 'Especialista' && (
                <>
                    <h3>Historial Clínico</h3>
                    <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Procedimiento:</Form.Label>
                        <Form.Select
                            value={historialData.id_procedimiento}
                            onChange={e => setHistorialData({ ...historialData, id_procedimiento: e.target.value })}
                        >
                            <option value="">Seleccione un procedimiento</option>
                            {procedimientos.map(proc => (
                                <option key={proc.id_procedimiento} value={proc.id_procedimiento}>
                                    {proc.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>Notas de la consulta:</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="notas_consulta"
                            value={historialData.notas_consulta || ''}
                            onChange={e => setHistorialData({ ...historialData, notas_consulta: e.target.value })}
                            placeholder="Detalles sobre la consulta"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tratamiento recomendado:</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="tratamiento_recomendado"
                            value={historialData.tratamiento_recomendado || ''}
                            onChange={e => setHistorialData({ ...historialData, tratamiento_recomendado: e.target.value })}
                            placeholder="Tratamiento sugerido post consulta"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Medicinas:</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="medicinas"
                            value={historialData.medicinas || ''}
                            onChange={e => setHistorialData({ ...historialData, medicinas: e.target.value })}
                            placeholder="Medicamentos prescritos, poner *ninguno* si no se receto ninguno"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Recomendaciones adicionales:</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="recomendaciones_adicionales"
                            value={historialData.recomendaciones_adicionales || ''}
                            onChange={e => setHistorialData({ ...historialData, recomendaciones_adicionales: e.target.value })}
                            placeholder="Cuidados adicionales, dieta, etc."
                        />
                    </Form.Group>
                    {/* Botones para acciones específicas del historial */}
                    {userRole === 'Especialista' && citaData.estado === 'completada' && !isEditing && (
                        <div className="mt-3">
                            <Button variant="info" onClick={handleCrearHistorialClinico} disabled={loading}>
                                Crear Historial Clínico
                            </Button>
                        </div>
                    )}
                    <div className="d-flex justify-content-between">
                    <Button variant="info" onClick={() => handleCrearHistorialClinico()} disabled={loading}>
                        Crear Historial Clínico
                    </Button>
                    </div>
                    </Form>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant={isEditing ? "success" : "primary"}
                    onClick={() => {
                        if (isEditing) {
                            handleUpdate();
                        } else {
                            toggleEdit();
                        }
                    }}
                    disabled={loading}
                >
                    {isEditing ? 'Guardar Cambios' : 'Editar Cita'}
                </Button>
                <Button variant="danger" onClick={handleDelete} disabled={loading || isEditing}>Eliminar Cita</Button>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </Modal.Footer>
            {loading && <div>Cargando...</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
        </Modal>
    );    
};

export default AppointmentDetailsModal;

