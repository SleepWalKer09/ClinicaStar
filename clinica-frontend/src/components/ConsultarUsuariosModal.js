import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Si es necesario redireccionar después de alguna acción

const ConsultarUsuariosModal = ({ onClose }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/read_usuarios/');
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
            await axios.delete(`http://localhost:8000/delete_usuarios/${usuarioId}`, {
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
        <div className="modal">
            <h2>Consultar Usuarios</h2>
            {error && <p className="error">{error}</p>}
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
                            <button onClick={() => handleEliminarUsuario(usuario.id_usuario)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
};

export default ConsultarUsuariosModal;
