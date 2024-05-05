// UsersModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersModal = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/ClinicaStar/read_usuarios/', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setUsers(response.data);
            } catch (error) {
                setError('Error al obtener los usuarios. ' + (error.response?.data?.detail || 'Por favor, intente de nuevo.'));
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="modal">
            <h2>Usuarios</h2>
            {error && <div className="error">{error}</div>}
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Teléfono</th>
                            <th>Edad</th>
                            <th>Genero</th>
                            <th>Dirección</th>
                            <th>Aseguradora</th>
                            <th>Alergias</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id_usuario}>
                                <td>{user.id_usuario}</td>
                                <td>{user.nombre}</td>
                                <td>{user.apellido}</td>
                                <td>{user.email}</td>
                                <td>{user.rol}</td>
                                <td>{user.phone}</td>
                                <td>{user.edad}</td>
                                <td>{user.genero}</td>
                                <td>{user.direccion}</td>
                                <td>{user.aseguradora}</td>
                                <td>{user.alergias}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button onClick={onClose} style={{ marginTop: '10px' }}>Cerrar</button>
        </div>
    );
};

export default UsersModal;
