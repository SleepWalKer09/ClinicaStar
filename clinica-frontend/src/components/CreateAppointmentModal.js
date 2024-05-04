import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Modal, Button, Form } from 'react-bootstrap';


const CreateAppointmentModal = ({ onClose, onCitaCreated, selectedDate }) => {
    const [citaData, setCitaData] = useState({
        fecha_hora: '',
        estado: 'programada',
        motivo: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role);

                if(decoded.role === 'Paciente') {
                    // Pacientes siempre crean citas con el especialista de consultas generales (ID = 4)
                    setCitaData(data => ({ ...data, id_especialista: 4, id_paciente: decoded.sub }));
                } else {
                    setCitaData(data => ({ ...data, id_especialista: decoded.sub }));
                }
            } catch (error) {
                console.error("Error decoding token: ", error);
            }
        }
    }, []);

    useEffect(() => {
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().slice(0, 16);
            setCitaData(data => ({ ...data, fecha_hora: formattedDate }));
        }
    }, [selectedDate]);


    const handleChange = e => {
        const { name, value } = e.target;
        setCitaData({ ...citaData, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        console.log("Enviando datos de cita:", citaData); 
        try {
            const response = await axios.post('http://localhost:8000/create_citas/', citaData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            onCitaCreated(response.data);
            setSuccessMessage('La cita ha sido creada con éxito.');
            setTimeout(() => {
                setSuccessMessage('');
                onClose();
            }, 3000);
        } catch (err) {
            setError(`Error al crear la cita: ${err.response?.data?.detail || 'Detalles no disponibles'}`);
            console.error("Error al crear la cita:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Crear nueva cita</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    {userRole === 'Especialista' && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>ID Paciente</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="id_paciente"
                                    value={citaData.id_paciente || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>ID Especialista</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="id_especialista"
                                    value={citaData.id_especialista || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha y Hora</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="fecha_hora"
                            value={citaData.fecha_hora}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Motivo</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="motivo"
                            value={citaData.motivo}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>Crear Cita</Button>
                </Form>
                {loading && <p>Cargando...</p>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateAppointmentModal;
