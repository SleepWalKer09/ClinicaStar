import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';

const ProcedimientosModal = ({ onClose }) => {
    const [procedimientos, setProcedimientos] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        description: '',
        duration: '',
        costo: '',
    });
    const [selectedProcedimientoId, setSelectedProcedimientoId] = useState(null);
    const [modalState, setModalState] = useState('add'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Cargar procedimientos al abrir el modal
    useEffect(() => {
        fetchProcedimientos();
    }, []);

    const fetchProcedimientos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/ClinicaStar/read_procedimientos/');
            setProcedimientos(response.data);
        } catch (error) {
            setError('Error al cargar procedimientos.');
            console.error('Error al cargar procedimientos:', error);
        }
        setLoading(false);
    };

    const handleEdit = (procedimiento) => {
        setFormData({
            nombre: procedimiento.nombre,
            description: procedimiento.description,
            duration: procedimiento.duration,
            costo: procedimiento.costo,
        });
        setSelectedProcedimientoId(procedimiento.id_procedimiento);
        setModalState('edit');
    };

    const handleDelete = async (procedimientoId) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8000/ClinicaStar/delete_procedimiento/${procedimientoId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchProcedimientos();
            alert('Procedimiento eliminado con éxito');
        } catch (error) {
            setError('Error al eliminar procedimiento.');
            console.error('Error al eliminar procedimiento:', error);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        const apiURL = 'http://localhost:8000/ClinicaStar';
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    
        try {
            let response;
            if (modalState === 'edit' && selectedProcedimientoId) {
                response = await axios.put(`${apiURL}/update_procedimiento/${selectedProcedimientoId}`, formData, { headers });
            } else {
                response = await axios.post(`${apiURL}/create_procedimientos/`, formData, { headers });
            }
    
            if (response.data) {
                fetchProcedimientos();
                onClose();
                alert('Procedimiento ' + (modalState === 'edit' ? 'actualizado' : 'añadido') + ' con éxito');
            }
        } catch (error) {
            setError(`Error al ${modalState === 'edit' ? 'actualizar' : 'añadir'} el procedimiento: ${error.response?.data?.detail || 'Detalles no disponibles'}`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Procedimientos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                
                <h3>Lista de Procedimientos</h3>
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Duración</th>
                                <th>Costo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {procedimientos.map((procedimiento) => (
                                <tr key={procedimiento.id_procedimiento}>
                                    <td>{procedimiento.id_procedimiento}</td>
                                    <td>{procedimiento.nombre}</td>
                                    <td>{procedimiento.description}</td>
                                    <td>{procedimiento.duration} min</td>
                                    <td>${procedimiento.costo}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(procedimiento)}>Editar</Button>{' '}
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(procedimiento.id_procedimiento)}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <Form onSubmit={handleSubmit} className="mt-4">
                <h3>Crear Procedimientos</h3>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            required
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción:</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Duración (minutos):</Form.Label>
                        <Form.Control
                            type="number"
                            name="duration"
                            required
                            value={formData.duration}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Costo:</Form.Label>
                        <Form.Control
                            type="number"
                            name="costo"
                            required
                            value={formData.costo}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {modalState === 'edit' ? 'Actualizar' : 'Añadir'}
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>Cerrar</Button>
            </Modal.Footer>
            {loading && <p>Cargando...</p>}
        </Modal>
    );
};

export default ProcedimientosModal;