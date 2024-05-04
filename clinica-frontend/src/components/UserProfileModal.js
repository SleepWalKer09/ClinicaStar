import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const UserProfileModal = ({ onClose, userId }) => {
    const [userData, setUserData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        rol: '',
        phone: '',
        edad: '',
        genero: '',
        direccion: '',
        aseguradora: '',
        alergias: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadUserProfile = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }
                const decoded = jwtDecode(token);
                const userId = decoded.sub; // Asumiendo que 'sub' es el ID del usuario en tu token

                const response = await axios.get(`http://localhost:8000/read_usuarios/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data);
            } catch (err) {
                setError('Error al cargar los datos del usuario.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            const userId = decoded.sub;

            const response = await axios.put(`http://localhost:8000/update_usuarios/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccessMessage('Los datos del perfil han sido actualizados con éxito.');
            setTimeout(() => {
                setSuccessMessage('');
                onClose();
            }, 3000);
        } catch (error) {
            setError('Error al actualizar los datos del usuario. ' + (error.response?.data?.detail || 'Por favor, intente de nuevo.'));
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Mi Perfil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control type="text" name="nombre" value={userData.nombre} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Apellido:</Form.Label>
                        <Form.Control type="text" name="apellido" value={userData.apellido} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control type="email" name="email" value={userData.email} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono:</Form.Label>
                        <Form.Control type="text" name="phone" value={userData.phone} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Edad:</Form.Label>
                        <Form.Control type="number" name="edad" value={userData.edad} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Género:</Form.Label>
                        <Form.Select name="genero" value={userData.genero} onChange={handleChange}>
                            <option value="">Seleccione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Dirección:</Form.Label>
                        <Form.Control type="text" name="direccion" value={userData.direccion} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Aseguradora:</Form.Label>
                        <Form.Control type="text" name="aseguradora" value={userData.aseguradora} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Alergias:</Form.Label>
                        <Form.Control as="textarea" name="alergias" value={userData.alergias} onChange={handleChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>Cerrar</Button>
                <Button variant="primary" type="submit" onClick={handleSubmit} disabled={loading}>Actualizar Datos</Button>
            </Modal.Footer>
            {loading && <p>Cargando...</p>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
        </Modal>
    );
};
                        
export default UserProfileModal;
                        