import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Modal, Button, Table, Form } from 'react-bootstrap';

const ConsultarHistorialModal = ({ onClose, userRole }) => {
    const [historiales, setHistoriales] = useState([]);
    const [historialSeleccionado, setHistorialSeleccionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [procedimientos, setProcedimientos] = useState([]);
    // Corrección: Añadir estado para `busquedaId`
    const [busquedaId, setBusquedaId] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.sub); // Establece el ID del usuario con el valor decodificado
        }
    }, []); // Este useEffect solo se ejecuta una vez al montar el componente
    
    useEffect(() => {
        if (userId && userRole === 'Paciente') {
            // Si hay un userId y el rol es paciente, entonces busca los historiales
            fetchHistoriales(userId);
        } else if (userRole === 'Especialista') {
            // Si el usuario es especialista, busca los procedimientos
            fetchProcedimientos();
        }
        // Esta dependencia asegura que la lógica se ejecute cada vez que cambie el userId o el userRole
    }, [userId, userRole]); 
    const fetchProcedimientos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/read_procedimientos/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setProcedimientos(response.data);
        } catch (error) {
            console.error('Error al cargar procedimientos:', error);
            setError('Error al cargar los procedimientos.');
        } finally {
            setLoading(false);
        }
    };

    const fetchHistoriales = async (usuarioId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/read_historiales_clinicos/${usuarioId}`);
            setHistoriales(response.data);
        } catch (error) {
            setError('Error al cargar el historial clínico.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = () => {
        if (userRole === 'Especialista') {
            fetchHistoriales(busquedaId);
        }
    };
    const iniciarEdicionHistorial = (historial) => {
        setHistorialSeleccionado(historial);
    };

    const handleEditarHistorial = async (e) => {
        //e.preventDefault(); // Esto previene la recarga de la página
        if (!historialSeleccionado) {
            return;
        }
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            };
            const response = await axios.put(`http://localhost:8000/update_historial_clinico/${historialSeleccionado.id_historial}`, historialSeleccionado, config);
            if (response.data) {
                alert('Historial clínico actualizado con éxito');
                fetchHistoriales(historialSeleccionado.id_usuario); // Asegúrate de que esta función refresque correctamente los historiales
            }
        } catch (error) {
            console.error('Error al actualizar el historial clínico:', error);
            setError('Error al actualizar el historial clínico. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarHistorial = async (historialId) => {
        setLoading(true);
        try {
            // Preparación de la cabecera Authorization con el token JWT
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
    
            // Llamada al endpoint de eliminación del historial clínico
            await axios.delete(`http://localhost:8000/delete_historial_clinico/${historialId}`, config);
    
            // Mostrar un mensaje de éxito
            alert('Historial clínico eliminado con éxito');
            // Opcionalmente, recargar los historiales clínicos para reflejar los cambios
            // Suponiendo que existe una función fetchHistoriales que recarga los historiales
            // y que necesitas el id_usuario para hacerlo, necesitarías mantenerlo en el estado
            // o encontrarlo de alguna otra manera.
            // fetchHistoriales(id_usuario);
        } catch (error) {
            console.error('Error al eliminar el historial clínico:', error);
            setError('Error al eliminar el historial clínico. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Consultar Historial Clínico</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                {userRole === 'Especialista' && (
                    <Form className="mb-4">
                        <Form.Group className="mb-3" controlId="busquedaId">
                            <Form.Label>Ingresa el ID del usuario:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="ID del usuario"
                                value={busquedaId || ''}
                                onChange={(e) => setBusquedaId(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleBuscar}>Buscar</Button>
                    </Form>
                )}
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ID Cita</th>
                                <th>ID Usuario</th>
                                <th>ID Especialista</th>
                                <th>ID Procedimiento</th>
                                <th>Notas Consulta</th>
                                <th>Tratamiento Recomendado</th>
                                <th>Medicinas</th>
                                <th>Recomendaciones Adicionales</th>
                                <th>Fecha Consulta</th>
                                {userRole === 'Especialista' && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {historiales.map((historial) => (
                                <tr key={historial.id_historial}>
                                    <td>{historial.id_historial}</td>
                                    <td>{historial.id_cita}</td>
                                    <td>{historial.id_usuario}</td>
                                    <td>{historial.id_especialista}</td>
                                    <td>{historial.id_procedimiento}</td>
                                    <td>{historial.notas_consulta}</td>
                                    <td>{historial.tratamiento_recomendado}</td>
                                    <td>{historial.medicinas}</td>
                                    <td>{historial.recomendaciones_adicionales}</td>
                                    <td>{new Date(historial.fecha_consulta).toLocaleDateString()}</td>
                                    {userRole === 'Especialista' && (
                                        <td>
                                            <Button variant="outline-primary" size="sm" onClick={() => iniciarEdicionHistorial(historial)}>Editar</Button>{' '}
                                            <Button variant="outline-danger" size="sm" onClick={() => handleEliminarHistorial(historial.id_historial)}>Eliminar</Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                {historialSeleccionado && (
                    <Form onSubmit={handleEditarHistorial}>
                        <h3>Editando Historial Clínico ID: {historialSeleccionado.id_historial}</h3>
                        <Form.Group className="mb-3">
                            <Form.Label>Procedimiento:</Form.Label>
                            <Form.Select
                                name="id_procedimiento"
                                value={historialSeleccionado.id_procedimiento}
                                onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, id_procedimiento: parseInt(e.target.value) })}
                            >
                                {procedimientos.map(proc => (
                                    <option key={proc.id_procedimiento} value={proc.id_procedimiento}>{proc.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Notas de la consulta:</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="notas_consulta"
                                value={historialSeleccionado.notas_consulta || ''}
                                onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, notas_consulta: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tratamiento recomendado:</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="tratamiento_recomendado"
                                value={historialSeleccionado.tratamiento_recomendado || ''}
                                onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, tratamiento_recomendado: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Medicinas:</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="medicinas"
                                value={historialSeleccionado.medicinas || ''}
                                onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, medicinas: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Recomendaciones adicionales:</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="recomendaciones_adicionales"
                                value={historialSeleccionado.recomendaciones_adicionales || ''}
                                onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, recomendaciones_adicionales: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de la consulta:</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha_consulta"
                                value={new Date(historialSeleccionado.fecha_consulta).toISOString().split('T')[0]}
                                onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, fecha_consulta: new Date(e.target.value).toISOString() })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Guardar Cambios</Button>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default ConsultarHistorialModal;