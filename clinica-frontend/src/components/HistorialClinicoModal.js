import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const ConsultarHistorialModal = ({ onClose, userRole }) => {
    const [historiales, setHistoriales] = useState([]);
    const [historialSeleccionado, setHistorialSeleccionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [procedimientos, setProcedimientos] = useState([]);
    // Corrección: Añadir estado para `busquedaId`
    const [busquedaId, setBusquedaId] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.sub); // Establece el ID del usuario con el valor decodificado
        }
    }, []); // Este useEffect solo se ejecuta una vez al montar el componente
    
    useEffect(() => {
        if (userId && userRole === 'Paciente') {
            // Si hay un userId y el rol es paciente, entonces busca los historiales
            fetchHistoriales(userId);
        } else if (userRole === 'Especialista') {
            // Si el usuario es especialista, busca los procedimientos
            fetchProcedimientos();
        }
        // Esta dependencia asegura que la lógica se ejecute cada vez que cambie el userId o el userRole
    }, [userId, userRole]); 
    const fetchProcedimientos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/read_procedimientos/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setProcedimientos(response.data);
        } catch (error) {
            console.error('Error al cargar procedimientos:', error);
            setError('Error al cargar los procedimientos.');
        } finally {
            setLoading(false);
        }
    };

    const fetchHistoriales = async (usuarioId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/read_historiales_clinicos/${usuarioId}`);
            setHistoriales(response.data);
        } catch (error) {
            setError('Error al cargar el historial clínico.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = () => {
        if (userRole === 'Especialista') {
            fetchHistoriales(busquedaId);
        }
    };
    const iniciarEdicionHistorial = (historial) => {
        setHistorialSeleccionado(historial);
    };

    const handleEditarHistorial = async (e) => {
        //e.preventDefault(); // Esto previene la recarga de la página
        if (!historialSeleccionado) {
            return;
        }
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            };
            const response = await axios.put(`http://localhost:8000/update_historial_clinico/${historialSeleccionado.id_historial}`, historialSeleccionado, config);
            if (response.data) {
                alert('Historial clínico actualizado con éxito');
                fetchHistoriales(historialSeleccionado.id_usuario); // Asegúrate de que esta función refresque correctamente los historiales
            }
        } catch (error) {
            console.error('Error al actualizar el historial clínico:', error);
            setError('Error al actualizar el historial clínico. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarHistorial = async (historialId) => {
        setLoading(true);
        try {
            // Preparación de la cabecera Authorization con el token JWT
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
    
            // Llamada al endpoint de eliminación del historial clínico
            await axios.delete(`http://localhost:8000/delete_historial_clinico/${historialId}`, config);
    
            // Mostrar un mensaje de éxito
            alert('Historial clínico eliminado con éxito');
            // Opcionalmente, recargar los historiales clínicos para reflejar los cambios
            // Suponiendo que existe una función fetchHistoriales que recarga los historiales
            // y que necesitas el id_usuario para hacerlo, necesitarías mantenerlo en el estado
            // o encontrarlo de alguna otra manera.
            // fetchHistoriales(id_usuario);
        } catch (error) {
            console.error('Error al eliminar el historial clínico:', error);
            setError('Error al eliminar el historial clínico. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <h2>Consultar Historial Clínico</h2>
            <h3>Ingresa el ID del usuario: </h3>
            {error && <p className="error">{error}</p>}
            {userRole === 'Especialista' && (
                <div>
                    <input
                        type="number"
                        placeholder="ID del usuario"
                        value={busquedaId || ''} // Corrección: Asegurarse de que busquedaId esté definido
                        onChange={(e) => setBusquedaId(e.target.value)} // Corrección: Asegurarse de que setBusquedaId esté definido
                    />
                    <button onClick={handleBuscar}>Buscar</button>
                </div>
            )}
            {historialSeleccionado && (
                <div>
                    <h3>Editando Historial Clínico ID: {historialSeleccionado.id_historial}</h3>
                    {historialSeleccionado && (
                        <form onSubmit={handleEditarHistorial}>
                            <div>
                                <label>Procedimiento:</label>
                                <select
                                    name="id_procedimiento"
                                    value={historialSeleccionado.id_procedimiento}
                                    onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, id_procedimiento: parseInt(e.target.value) })}
                                >
                                    {procedimientos.map(proc => (
                                        <option key={proc.id_procedimiento} value={proc.id_procedimiento}>{proc.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Notas de la consulta:</label>
                                <textarea
                                    name="notas_consulta"
                                    value={historialSeleccionado.notas_consulta || ''}
                                    onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, notas_consulta: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Tratamiento recomendado:</label>
                                <textarea
                                    name="tratamiento_recomendado"
                                    value={historialSeleccionado.tratamiento_recomendado || ''}
                                    onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, tratamiento_recomendado: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Medicinas:</label>
                                <textarea
                                    name="medicinas"
                                    value={historialSeleccionado.medicinas || ''}
                                    onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, medicinas: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Recomendaciones adicionales:</label>
                                <textarea
                                    name="recomendaciones_adicionales"
                                    value={historialSeleccionado.recomendaciones_adicionales || ''}
                                    onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, recomendaciones_adicionales: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Fecha de la consulta:</label>
                                <input
                                    type="date"
                                    name="fecha_consulta"
                                    value={new Date(historialSeleccionado.fecha_consulta).toISOString().split('T')[0]}
                                    onChange={e => setHistorialSeleccionado({ ...historialSeleccionado, fecha_consulta: new Date(e.target.value).toISOString() })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit">Guardar Cambios</button>
                            </div>
                        </form>
                    )}
                </div>
            )}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID Cita</th>
                        <th>ID Usuario</th>
                        <th>ID Especialista</th>
                        <th>ID Procedimiento</th>
                        <th>Notas Consulta</th>
                        <th>Tratamiento Recomendado</th>
                        <th>Medicinas</th>
                        <th>Recomendaciones Adicionales</th>
                        <th>Fecha Consulta</th>
                        {userRole === 'Especialista' && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {historiales.map((historial) => (
                        <tr key={historial.id_historial}>
                            <td>{historial.id_historial}</td>
                            <td>{historial.id_cita}</td>
                            <td>{historial.id_usuario}</td>
                            <td>{historial.id_especialista}</td>
                            <td>{historial.id_procedimiento}</td>
                            <td>{historial.notas_consulta}</td>
                            <td>{historial.tratamiento_recomendado}</td>
                            <td>{historial.medicinas}</td>
                            <td>{historial.recomendaciones_adicionales}</td>
                            <td>{new Date(historial.fecha_consulta).toLocaleDateString()}</td>
                            {userRole === 'Especialista' && (
                                <td>
                                    <button onClick={() => iniciarEdicionHistorial(historial)}>Editar</button>
                                    <button onClick={() => handleEliminarHistorial(historial.id_historial)}>Eliminar</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
};

export default ConsultarHistorialModal