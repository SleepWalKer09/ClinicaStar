import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const CreateAppointmentModal = ({ onClose, onCitaCreated }) => {
    const [citaData, setCitaData] = useState({
        fecha_hora: '',
        estado: 'programada',
        motivo: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role);

                if(decoded.role === 'Paciente') {
                    // Pacientes siempre crean citas con el especialista de consultas generales (ID = 4)
                    setCitaData(data => ({ ...data, id_especialista: 4, id_paciente: decoded.sub }));
                } else {
                    setCitaData(data => ({ ...data, id_especialista: decoded.sub }));
                }
            } catch (error) {
                console.error("Error decoding token: ", error);
            }
        }
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setCitaData({ ...citaData, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        console.log("Enviando datos de cita:", citaData); 
        try {
            const response = await axios.post('http://localhost:8000/create_citas/', citaData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            onCitaCreated(response.data);
            setSuccessMessage('La cita ha sido creada con éxito.');
            setTimeout(() => {
                setSuccessMessage('');
                onClose();
            }, 3000);
        } catch (err) {
            setError(`Error al crear la cita: ${err.response?.data?.detail || 'Detalles no disponibles'}`);
            console.error("Error al crear la cita:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <h2>Crear nueva cita</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                {userRole === 'Especialista' && (
                    <>
                        <div>
                            <label>ID Paciente</label>
                            <input
                                type="number"
                                name="id_paciente"
                                value={citaData.id_paciente || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>ID Especialista</label>
                            <input
                                type="number"
                                name="id_especialista"
                                value={citaData.id_especialista || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}
                <label>Fecha y Hora</label>
                <input
                    type="datetime-local"
                    name="fecha_hora"
                    value={citaData.fecha_hora}
                    onChange={handleChange}
                    required
                />
                <label>Motivo</label>
                <textarea
                    name="motivo"
                    value={citaData.motivo}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>Crear Cita</button>
            </form>
            {loading && <p>Cargando...</p>}
            {successMessage && <div className="success">{successMessage}</div>}
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
};

export default CreateAppointmentModal;
