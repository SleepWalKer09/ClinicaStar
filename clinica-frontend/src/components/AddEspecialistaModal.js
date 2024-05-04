import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const AddEspecialistaModal = ({ onClose, onEspecialistaAdded }) => {
    const [especialistaData, setEspecialistaData] = useState({
        id_usuario: '',
        especialidad: '',
        description: '',
    });
    const [especialistas, setEspecialistas] = useState([]);
    const [selectedEspecialistaId, setSelectedEspecialistaId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEspecialistas();
    }, []);

    useEffect(() => {
        if (selectedEspecialistaId) {
            const selectedEspecialista = especialistas.find(especialista => especialista.id_especialista === selectedEspecialistaId);
            setEspecialistaData({
                id_usuario: selectedEspecialista.id_usuario.toString(),
                especialidad: selectedEspecialista.especialidad,
                description: selectedEspecialista.description,
            });
        } else {
            resetForm();
        }
    }, [selectedEspecialistaId, especialistas]);

    const fetchEspecialistas = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/read_especialistas/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setEspecialistas(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error al obtener los especialistas.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setEspecialistaData({ ...especialistaData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const endpoint = selectedEspecialistaId ? `update_especialista/${selectedEspecialistaId}` : 'create_especialistas/';
        const method = selectedEspecialistaId ? axios.put : axios.post;

        try {
            await method(`http://localhost:8000/${endpoint}`, especialistaData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchEspecialistas(); // Refresh the list of especialistas
            resetForm();
            onClose();
        } catch (error) {
            setError(`Error al ${selectedEspecialistaId ? 'actualizar' : 'agregar'} el especialista.`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEspecialistaData({
            id_usuario: '',
            especialidad: '',
            description: '',
        });
        setSelectedEspecialistaId(null);
    };

    async function handleDeleteEspecialista(especialistaId) {
        setLoading(true);
        const isConfirmed = window.confirm("¿Estás seguro de que quieres eliminar este especialista? Esta acción no se puede deshacer.");
        if (isConfirmed) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:8000/delete_especialista/${especialistaId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const updatedEspecialistas = especialistas.filter(especialista => especialista.id_especialista !== especialistaId);
                setEspecialistas(updatedEspecialistas);
                if (selectedEspecialistaId === especialistaId) {
                    resetForm();
                }
            } catch (error) {
                setError('Error al eliminar el especialista.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <Modal show={true} onHide={onClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>{selectedEspecialistaId ? 'Actualizar' : 'Agregar'} Especialista</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>ID Usuario:</Form.Label>
                        <Form.Control
                            type="number"
                            name="id_usuario"
                            required
                            value={especialistaData.id_usuario}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Especialidad:</Form.Label>
                        <Form.Control
                            type="text"
                            name="especialidad"
                            required
                            value={especialistaData.especialidad}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción:</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={especialistaData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {selectedEspecialistaId ? 'Actualizar' : 'Agregar'}
                    </Button>
                    {selectedEspecialistaId && (
                        <Button variant="secondary" onClick={resetForm} disabled={loading}>
                            Cancelar Edición
                        </Button>
                    )}
                </Form>
                <h3>Especialistas Existentes</h3>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>ID Especialista</th>
                            <th>Especialidad</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {especialistas.map((esp) => (
                            <tr key={esp.id_especialista}>
                                <td>{esp.id_especialista}</td>
                                <td>{esp.especialidad}</td>
                                <td>{esp.description}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm" onClick={() => setSelectedEspecialistaId(esp.id_especialista)}>Editar</Button>{' '}
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteEspecialista(esp.id_especialista)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddEspecialistaModal;