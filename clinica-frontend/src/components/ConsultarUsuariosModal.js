import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { Modal, Button, Table } from 'react-bootstrap';

const ConsultarUsuariosModal = ({ onClose }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/ClinicaStar/read_usuarios/');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
            setError('Error al cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    };

    
    const handleEliminarUsuario = async (usuarioId) => {
        const isConfirmed = window.confirm('¿Está seguro que desea eliminar este usuario?');
        if (!isConfirmed) {
            return;
        }
    
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8000/ClinicaStar/delete_usuarios/${usuarioId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Usuario eliminado con éxito');
            fetchUsuarios(); // Recargar la lista de usuarios
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            setError('Error al eliminar el usuario.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Consultar Usuarios</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive"> {/* Envolver la tabla en este div */}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Teléfono</th>
                                <th>Edad</th>
                                <th>Género</th>
                                <th>Dirección</th>
                                <th>Aseguradora</th>
                                <th>Alergias</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id_usuario}>
                                <td>{usuario.id_usuario}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.rol}</td>
                                <td>{usuario.phone}</td>
                                <td>{usuario.edad}</td>
                                <td>{usuario.genero}</td>
                                <td>{usuario.direccion}</td>
                                <td>{usuario.aseguradora}</td>
                                <td>{usuario.alergias}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => handleEliminarUsuario(usuario.id_usuario)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConsultarUsuariosModal;