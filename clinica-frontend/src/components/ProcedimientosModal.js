import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProcedimientosModal = ({ onClose }) => {
    const [procedimientos, setProcedimientos] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        description: '',
        duration: '',
        costo: '',
    });
    const [selectedProcedimientoId, setSelectedProcedimientoId] = useState(null);
    const [modalState, setModalState] = useState('add'); // 'add' para añadir, 'edit' para editar
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Cargar procedimientos al abrir el modal
    useEffect(() => {
        fetchProcedimientos();
    }, []);

    const fetchProcedimientos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/read_procedimientos/');
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
            await axios.delete(`http://localhost:8000/delete_procedimiento/${procedimientoId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchProcedimientos(); // Recargar lista después de eliminar
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
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
        setLoading(true);
        setError('');
    
        const apiURL = 'http://localhost:8000';
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    
        try {
            let response;
            if (modalState === 'edit' && selectedProcedimientoId) {
                response = await axios.put(`${apiURL}/update_procedimiento/${selectedProcedimientoId}`, formData, { headers });
            } else {
                response = await axios.post(`${apiURL}/create_procedimientos/`, formData, { headers });
            }
    
            if (response.data) {
                fetchProcedimientos(); // Recargar la lista de procedimientos
                onClose(); // Cerrar el modal
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
        <div className="modal">
            <h2>Procedimientos</h2>
            {error && <div className="error">{error}</div>}
    
            {/* Tabla de Procedimientos */}
            <div>
                <h3>Lista de Procedimientos</h3>
                <table>
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
                                    <button onClick={() => handleEdit(procedimiento)}>Editar</button>
                                    <button onClick={() => handleDelete(procedimiento.id_procedimiento)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    
            {/* Formulario para Añadir/Editar Procedimientos */}
            <div>
                <h3>{modalState === 'edit' ? 'Editar Procedimiento' : 'Añadir Procedimiento'}</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="description">Descripción:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <label htmlFor="duration">Duración (minutos):</label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="costo">Costo:</label>
                    <input
                        type="number"
                        name="costo"
                        value={formData.costo}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>{modalState === 'edit' ? 'Actualizar' : 'Añadir'}</button>
                </form>
            </div>
    
            <button onClick={onClose} disabled={loading}>Cerrar</button>
            {loading && <p>Cargando...</p>}
        </div>
    );
};

export default ProcedimientosModal;
