import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    return (
        <div className="modal">
            <h2>{selectedEspecialistaId ? 'Actualizar' : 'Agregar'} Especialista</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID Usuario:</label>
                    <input
                        type="number"
                        name="id_usuario"
                        value={especialistaData.id_usuario}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Especialidad:</label>
                    <input
                        type="text"
                        name="especialidad"
                        value={especialistaData.especialidad}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        name="description"
                        value={especialistaData.description}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {selectedEspecialistaId ? 'Actualizar' : 'Agregar'}
                </button>
                {selectedEspecialistaId && (
                    <button onClick={resetForm} disabled={loading}>
                        Cancelar Edición
                    </button>
                )}
                <button onClick={onClose} disabled={loading}>
                    Cerrar
                </button>
            </form>
            {loading && <p>Cargando...</p>}
            <h3>Especialistas Existentes</h3>
            <table>
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
                            <button onClick={() => setSelectedEspecialistaId(esp.id_especialista)}>Editar</button>
                            <button onClick={() => handleDeleteEspecialista(esp.id_especialista)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

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
};

export default AddEspecialistaModal;