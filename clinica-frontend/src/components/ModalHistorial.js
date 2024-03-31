import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const ModalHistorial = ({ onClose, citaId, usuarioId, especialistaId, isEspecialista }) => {
    const [historiales, setHistoriales] = useState([]);
    const [procedimientos, setProcedimientos] = useState([]);
    const [selectedHistorial, setSelectedHistorial] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        fetchProcedimientos();
        if (isEspecialista) {
            // Para especialistas: Cargar historiales asociados a la cita o al usuario
            fetchHistorialesClinicos();
        }
    }, []);

    const fetchProcedimientos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/read_procedimientos/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setProcedimientos(response.data);
        } catch (err) {
            console.error('Error al obtener procedimientos:', err);
            setError('No se pudieron cargar los procedimientos.');
        }
    };

    const fetchHistorialesClinicos = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/read_historiales_clinicos/${usuarioId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setHistoriales(response.data);
        } catch (err) {
            console.error('Error al obtener historiales clínicos:', err);
            setError('No se pudieron cargar los historiales clínicos.');
        }
    };

    // Aquí irían las funciones para manejar CRUD (createHistorialClinico, updateHistorialClinico, deleteHistorialClinico)
    // Ten en cuenta que debes incluir lógica para manejar el estado del formulario, 
    // validaciones, y la interacción con los endpoints de la API.

    return (
        <div className="modal">
            <h2>Historial Clínico</h2>
            {error && <p className="error">{error}</p>}
            {/* Aquí iría el contenido del modal, incluyendo la lógica para mostrar formulario de nuevo historial,
                mostrar historiales existentes, o editar un historial seleccionado, dependiendo del contexto. */}
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
};

export default ModalHistorial;
