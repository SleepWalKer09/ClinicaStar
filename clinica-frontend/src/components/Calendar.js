import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de tener jwt-decode instalado
import CreateAppointmentModal from './CreateAppointmentModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';



const CalendarComponent = ({ usuario_id, rol, onCitaClick, onDayClick }) => {
    const [citas, setCitas] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);

    console.log("Calendario usuario_id: ",usuario_id)
    console.log("Calendario rol: ",rol)

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found, redirecting to login...");
            return;
        }
        const decoded = jwtDecode(token);
        const fetchCitas = async () => {
            try {
                console.log(`Fetching citas for usuario_id: ${decoded.sub}, rol: ${decoded.role}`);
                const response = await axios.get(`http://localhost:8000/ClinicaStar/read_citas_usuario/?usuario_id=${decoded.sub}&rol=${decoded.role}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Citas fetched successfully:", response.data);
                setCitas(response.data);
            } catch (error) {
                console.error("Error al obtener las citas:", error);
            }
        };

        fetchCitas();
    }, []);

    const updateCitas = (updatedCita) => {
        setCitas(currentCitas => {
            const index = currentCitas.findIndex(c => c.id === updatedCita.id);
            if (index !== -1) {
                // Actualiza la cita existente
                return currentCitas.map(cita => cita.id === updatedCita.id ? { ...cita, ...updatedCita } : cita);
            } else {
                // Si la cita actualizada no está en la lista, añádela (esto normalmente no debería suceder en una actualización)
                return [...currentCitas, updatedCita];
            }
        });
    };

    const deleteCita = (citaId) => {
        setCitas(currentCitas => currentCitas.filter(cita => cita.id !== citaId));
    };

    const handleDayClick = (date) => {
        setSelectedDate(date);
        const dayCitas = citas.filter(cita => {
            const citaDate = new Date(cita.fecha_hora);
            return date.getFullYear() === citaDate.getFullYear() &&
                date.getMonth() === citaDate.getMonth() &&
                date.getDate() === citaDate.getDate();
        });

        if (dayCitas.length > 0) {
            setSelectedCita(dayCitas[0]);
            setShowDetailsModal(true);
        } else {
            setShowCreateModal(true);
        }
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dayCitas = citas.filter(cita => {
                const citaDate = new Date(cita.fecha_hora);
                return date.getFullYear() === citaDate.getFullYear() &&
                    date.getMonth() === citaDate.getMonth() &&
                    date.getDate() === citaDate.getDate();
            });

            if (dayCitas.length > 0) {
                const estado = dayCitas[0].estado;
                let colorClass;
                switch (estado.toLowerCase()) {
                    case 'programada':
                        colorClass = 'bg-warning';
                        break;
                    case 'completada':
                        colorClass = 'bg-success';
                        break;
                    case 'cancelada':
                        colorClass = 'bg-danger';
                        break;
                    default:
                        colorClass = 'bg-secondary';
                }

                return <div className={`rounded-circle ${colorClass}`} style={{ width: '20px', height: '20px', margin: 'auto' }} />;
            }
        }
    };

    return (
        <>
            <Calendar onClickDay={handleDayClick} tileContent={tileContent} />
            {showCreateModal && (
                <CreateAppointmentModal
                    onClose={() => setShowCreateModal(false)}
                    onCitaCreated={updateCitas}
                    selectedDate={selectedDate}
                />
            )}
            {showDetailsModal && selectedCita && (
            <AppointmentDetailsModal
                citaId={selectedCita.id_cita}
                onClose={() => setShowDetailsModal(false)}
                onCitaUpdated={updateCitas}  // Asegúrate de que esta función está definida en CalendarComponent
                onCitaDeleted={deleteCita}  // Asegúrate de que esta función también está definida si la usas
            />
        )}
        </>
    );
};

export default CalendarComponent;