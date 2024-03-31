import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de tener jwt-decode instalado


const CalendarComponent = ({ usuario_id, rol, onCitaClick, onDayClick }) => {
    const [citas, setCitas] = useState([]);
    console.log("Calendario usuario_id: ",usuario_id)
    console.log("Calendario rol: ",rol)

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found, redirecting to login...");
            return;
        }
        const decoded = jwtDecode(token);
        const usuario_id = decoded.sub;
        const rol = decoded.role;
        console.log("Calendario JWT usuario_id: ",usuario_id)
        console.log("Calendario JWT rol: ",rol)

        const fetchCitas = async () => {
            try {
                console.log(`Fetching citas for usuario_id: ${usuario_id}, rol: ${rol}`);
                const response = await axios.get(`http://localhost:8000/read_citas/?usuario_id=${usuario_id}&rol=${rol}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Citas fetched successfully:", response.data);
                setCitas(response.data);
            } catch (error) {
                console.error("Error al obtener las citas:", error);
            }
        };

        if (usuario_id && rol) {
            fetchCitas();
        }
    }, [usuario_id, rol]);

    const handleDayClick = (date) => {
        const dayCitas = citas.filter(cita => {
            const citaDate = new Date(cita.fecha_hora);
            return date.getFullYear() === citaDate.getFullYear() &&
                date.getMonth() === citaDate.getMonth() &&
                date.getDate() === citaDate.getDate();
        });

        // Si hay citas para este día, abre el modal de detalles para la primera cita
        if (dayCitas.length > 0) {
            // Asegúrate de pasar solo el id_cita al método onCitaClick
            onCitaClick(dayCitas[0].id_cita);
        } else {
            onDayClick(date);
        }
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            let dayCitas = citas.filter(cita => {
                const citaDate = new Date(cita.fecha_hora);
                return date.getFullYear() === citaDate.getFullYear() &&
                    date.getMonth() === citaDate.getMonth() &&
                    date.getDate() === citaDate.getDate();
            });

            if (dayCitas.length > 0) {
                const estado = dayCitas[0].estado;
                let color;
                switch (estado.toLowerCase()) {
                    case 'programada':
                        color = 'yellow';
                        break;
                    case 'completada':
                        color = 'green';
                        break;
                    case 'cancelada':
                        color = 'red';
                        break;
                    default:
                        color = 'grey';
                }

                return <div style={{ backgroundColor: color, borderRadius: '50%', width: '10px', height: '10px', margin: 'auto' }} />;
            }
        }
    };

    return <Calendar onClickDay={handleDayClick} tileContent={tileContent} />;
};

export default CalendarComponent;