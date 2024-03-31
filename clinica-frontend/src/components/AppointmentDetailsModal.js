import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import {jwtDecode} from 'jwt-decode';

const AppointmentDetailsModal = ({ citaId, onClose, onCitaUpdated, onCitaDeleted }) => {
    const [citaData, setCitaData] = useState({
        id_paciente: '',
        id_especialista: '',
        fecha_hora: '',
        estado: '',
        motivo: '',
    });
    const [procedimientos, setProcedimientos] = useState([]);
    const [historialData, setHistorialData] = useState({
        id_procedimiento: '',
        notas_consulta: '',
        tratamiento_recomendado: '',
        medicinas: '',
        recomendaciones_adicionales: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUserRole(decoded.role);
        }

        const fetchCitaDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/read_citas/${citaId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formattedFechaHora = format(parseISO(response.data.fecha_hora), "yyyy-MM-dd'T'HH:mm");
                setCitaData({ ...response.data, fecha_hora: formattedFechaHora });
            } catch (err) {
                setError('Error al cargar los detalles de la cita.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const fetchProcedimientos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/read_procedimientos/');
                setProcedimientos(response.data);
            } catch (error) {
                console.error('Error al cargar procedimientos:', error);
            }
        };

        fetchCitaDetails();
        fetchProcedimientos();
    }, [citaId]);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleStateChange = (e) => {
        const { name, value } = e.target;
        setCitaData(prevState => ({ ...prevState, [name]: value }));
        // Manejar el caso especial para 'estado', donde puede necesitarse resetear historialData
        if (name === 'estado' && value !== 'completada') {
            setHistorialData({
                id_procedimiento: '',
                notas_consulta: '',
                tratamiento_recomendado: '',
                medicinas: '',
                recomendaciones_adicionales: ''
            });
        }
    };

    const handleUpdate = async () => {
        if (!isEditing) {
            // Si no está en modo edición, habilitar la edición y detener aquí
            setIsEditing(true);
            return;
        }

        // Si está en modo edición, proceder a guardar los cambios
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:8000/update_citas/${citaId}`, citaData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            onCitaUpdated(response.data);
            setIsEditing(false); // Deshabilitar la edición después de actualizar
            setSuccessMessage('La cita ha sido actualizada con éxito.');
            setTimeout(() => {
                setSuccessMessage('');
                onClose();
            }, 3000); // Cierra el modal y limpia el mensaje después de 3 segundos
        } catch (err) {
            setError('Error al actualizar la cita.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8000/delete_citas/${citaId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            onCitaDeleted(citaId);
            setSuccessMessage('La cita ha sido eliminada con éxito.');
            setTimeout(() => {
                setSuccessMessage('');
                onClose();
            }, 3000); 
        } catch (err) {
            setError('Error al eliminar la cita.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCrearHistorialClinico = async () => {
        
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        };
    
        const historialClinicoData = {
            id_cita: citaId,
            id_usuario: citaData.id_paciente,
            id_especialista: citaData.id_especialista,
            id_procedimiento: historialData.id_procedimiento,
            notas_consulta: historialData.notas_consulta,
            tratamiento_recomendado: historialData.tratamiento_recomendado,
            medicinas: historialData.medicinas,
            recomendaciones_adicionales: historialData.recomendaciones_adicionales,
            fecha_consulta: new Date(citaData.fecha_hora)
        };
        if (!historialData.id_procedimiento) {
            setError("Por favor, seleccione un procedimiento.");
            return;
        }
    
        try {
            const response = await axios.post(
                `http://localhost:8000/create_historial_clinico/`,historialClinicoData,
                { headers }
            );
    
            if (response.data) {
                setSuccessMessage('Historial clínico creado con éxito.');
                // Aquí puedes implementar cualquier lógica adicional tras la creación exitosa, como cerrar el modal o recargar datos.
            }
        } catch (error) {
            console.error('Error al crear historial clínico:', error);
            setError('Error al crear historial clínico. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <div className="modal">
            <h2>Detalles de la cita</h2>
            {error && <p className="error">{error}</p>}
            <form>
                <label>Fecha y hora</label>
                <input
                    type="datetime-local"
                    name="fecha_hora"
                    value={citaData.fecha_hora}
                    onChange={(e) => setCitaData({ ...citaData, fecha_hora: e.target.value })}
                    disabled={!isEditing}
                />
                <label>Estado</label>
                <select
                    name="estado"
                    value={citaData.estado}
                    onChange={handleStateChange}
                    disabled={!isEditing || (userRole === 'Paciente' && citaData.estado === 'completada')}
                >
                    <option value="programada">Programada</option>
                    {userRole === 'Especialista' && <option value="completada">Completada</option>}
                    <option value="cancelada">Cancelada</option>
                </select>
                <label>Motivo</label>
                <textarea
                    name="motivo"
                    value={citaData.motivo}
                    onChange={(e) => setCitaData({ ...citaData, motivo: e.target.value })}
                    disabled={!isEditing}
                />
            </form>
            {citaData.estado === 'completada' && userRole === 'Especialista' && (
                <>
                    <h3>Historial Clínico</h3>
                    <form>
                        <div className="form-group">
                            <label>Procedimiento:</label>
                            <select
                                name="id_procedimiento"
                                value={historialData.id_procedimiento}
                                onChange={e => setHistorialData({ ...historialData, id_procedimiento: parseInt(e.target.value) })}
                            >
                                {/* Asegúrate de que cada opción tenga como valor el id_procedimiento */}
                                {procedimientos.map((proc) => (
                                    <option key={proc.id_procedimiento} value={proc.id_procedimiento}>
                                        {proc.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                        <label>Notas de la consulta:</label>
                            <textarea
                                name="notas_consulta"
                                value={historialData.notas_consulta || ''}
                                onChange={e => setHistorialData({ ...historialData, notas_consulta: e.target.value })}
                                placeholder="Detalles sobre la consulta"
                            />
                        </div>
                        <label>Tratamiento recomendado:</label>
                        <textarea
                            name="tratamiento_recomendado"
                            value={historialData.tratamiento_recomendado || ''}
                            onChange={e => setHistorialData({ ...historialData, tratamiento_recomendado: e.target.value })}
                            placeholder="Tratamiento sugerido post consulta"
                        />

                        <label>Medicinas:</label>
                        <textarea
                            name="medicinas"
                            value={historialData.medicinas || ''}
                            onChange={e => setHistorialData({ ...historialData, medicinas: e.target.value })}
                            placeholder="Medicamentos prescritos, poner *ninguno* si no se receto ninguno"
                        />

                        <label>Recomendaciones adicionales:</label>
                        <textarea
                            name="recomendaciones_adicionales"
                            value={historialData.recomendaciones_adicionales || ''}
                            onChange={e => setHistorialData({ ...historialData, recomendaciones_adicionales: e.target.value })}
                            placeholder="Cuidados adicionales, dieta, etc."
                        />
                        <div className="modal-actions">
                            <button type="button" onClick={handleCrearHistorialClinico} disabled={loading}>
                                Crear Historial Clínico
                            </button>
                        </div>
                    </form>
                </>
            )}
            <div className="modal-actions">
            <button
                onClick={() => {
                    if (isEditing) {
                        handleUpdate();
                    } else {
                        toggleEdit();
                    }
                }}
                disabled={loading}
            >
                {isEditing ? 'Guardar Cambios' : 'Editar Cita'}
            </button>
            <button onClick={handleDelete} disabled={loading || isEditing}>Eliminar Cita</button>
            <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );    
};

export default AppointmentDetailsModal;


// Se realizo con exito el procedimiento de Limpieza dental, se removio el sarro de todos los dientes junto a una limpieza de lengua
// Cepillado 3 veces al dia despues de cada comida, Evitar alimentos muy frios o muy calientes debido a sensibilidad de encias y nervios, Comprar cepillo para encias sencibles
// Enguage bucal Listerine para evitar gengivitis, tomar 5 ML cada 12 horas por 7 dias NO SE DEBE SEGUIR ADMINISTRANDO POR DIAS POSTERIORES, ya que es posible que el paciente genere defensas contra el medicamento
// Dieta normal, Seguir estrictamente las instrucciones del enguage, usar hilo dental  luego del cepillado.