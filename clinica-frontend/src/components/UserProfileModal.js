import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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
        <div className="modal">
            <h2>Mi Perfil</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                {/* Formulario con los campos para editar los datos del usuario */}
                <div>
                    <label>Nombre:</label>
                    <input type="text" name="nombre" value={userData.nombre} onChange={handleChange} />
                </div>
                <div>
                    <label>Apellido:</label>
                    <input type="text" name="apellido" value={userData.apellido} onChange={handleChange} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={userData.email} onChange={handleChange} />
                </div>
                {/* Rol y otros campos no editables o manejados de forma especial */}
                <div>
                    <label>Teléfono:</label>
                    <input type="text" name="phone" value={userData.phone} onChange={handleChange} />
                </div>
                <div>
                    <label>Edad:</label>
                    <input type="number" name="edad" value={userData.edad} onChange={handleChange} />
                </div>
                <div>
                    <label>Género:</label>
                    <select name="genero" value={userData.genero} onChange={handleChange}>
                        <option value="">Seleccione</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                <div>
                    <label>Dirección:</label>
                    <input type="text" name="direccion" value={userData.direccion} onChange={handleChange} />
                </div>
                <div>
                    <label>Aseguradora:</label>
                    <input type="text" name="aseguradora"
                        value={userData.aseguradora} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Alergias:</label>
                            <textarea name="alergias" value={userData.alergias} onChange={handleChange} />
                        </div>
                        <div className="modal-actions">
                            <button type="submit" disabled={loading}>Actualizar Datos</button>
                            <button onClick={onClose} disabled={loading}>Cerrar</button>
                        </div>
            </form>
            {loading && <p>Cargando...</p>}
            {successMessage && <div className="success">{successMessage}</div>}
        </div>
    );
};
                        
export default UserProfileModal;
                        