import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
//import axios from 'axios';
import Navbar from './Navbar';
import CalendarComponent from './Calendar';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import CreateAppointmentModal from './CreateAppointmentModal';
import AddEspecialistaModal from './AddEspecialistaModal';
import UserProfileModal from './UserProfileModal';
import ProcedimientosModal from './ProcedimientosModal';
import ConsultarHistorialModal from './HistorialClinicoModal'; 
import ConsultarUsuariosModal from './ConsultarUsuariosModal';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [selectedCita, setSelectedCita] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddEspecialistaModalOpen, setIsAddEspecialistaModalOpen] = useState(false); // Estado para el modal de añadir especialista
    const [isConsultarUsuariosModalOpen, setIsConsultarUsuariosModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Estado para el modal de mi perfil
    const [isProcedimientosModalOpen, setIsProcedimientosModalOpen] = useState(false);
    const [isConsultarHistorialModalOpen, setIsConsultarHistorialModalOpen] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Error decoding token: ", error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const openCreateModal = (date) => {
        setIsCreateModalOpen(true);
    };

    const openDetailsModal = (cita) => {
        setSelectedCita(cita);
        setIsDetailsModalOpen(true);
    };

    const handleCitaCreated = (newCita) => {
        setIsCreateModalOpen(false);
    };

    const handleCitaUpdated = (updatedCita) => {
        setIsDetailsModalOpen(false);
    };

    const handleCitaDeleted = (deletedCitaId) => {
        setIsDetailsModalOpen(false);
    };

    const openAddEspecialistaModal = () => {
        setIsAddEspecialistaModalOpen(true);
    };

    const openConsultarUsuariosModal = () => {
        setIsConsultarUsuariosModalOpen(true);
    };   

    const handleOpenProfileModal = () => {
        setIsProfileModalOpen(true);
    };

    const openProcedimientosModal = () => {
        setIsProcedimientosModalOpen(true);
    };

    const openConsultarHistorialModal = () => {
        setIsConsultarHistorialModalOpen(true);
    };

    return (
        <div className="MainPage">
            <div className="header">
                <Navbar
                    onLogout={handleLogout}
                    showAddSpecialist={user.role === 'Especialista'}
                    onAddSpecialist={openAddEspecialistaModal}
                    showConsultUsers={user.role === 'Especialista'}
                    onConsultarUsuarios={openConsultarUsuariosModal}
                    onOpenProfileModal={handleOpenProfileModal}
                    onProcedimientosClick={openProcedimientosModal}
                    userRole={user.role}
                    onConsultarHistorial={openConsultarHistorialModal} // Aquí pasas la prop correctamente
                />
                
                <h1>Clínica Star Platinum</h1>
                <p>Risus noster stella!</p>
            </div>
            <div className="calendar-container">
                <CalendarComponent
                    usuario_id={user?.usuario_id}
                    rol={user?.rol}
                    onCitaClick={openDetailsModal}
                    onDayClick={openCreateModal}
                />
            </div>
            {isDetailsModalOpen && (
                <AppointmentDetailsModal
                    citaId={selectedCita}
                    onClose={() => setIsDetailsModalOpen(false)}
                    onCitaUpdated={handleCitaUpdated}
                    onCitaDeleted={handleCitaDeleted}
                    userRole={user.role}
                    userId={user.usuario_id}
                />
            )}
            {isCreateModalOpen && (
                <CreateAppointmentModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCitaCreated={handleCitaCreated}
                />
            )}
            {isAddEspecialistaModalOpen && (
                <AddEspecialistaModal
                    onClose={() => setIsAddEspecialistaModalOpen(false)}
                />
            )}
            {/* Incluir los modales como antes y agregar el nuevo modal de Consultar Usuarios */}
            {isConsultarUsuariosModalOpen && (
                <ConsultarUsuariosModal
                    onClose={() => setIsConsultarUsuariosModalOpen(false)}
                />
            )}
            {isProfileModalOpen && (
                <UserProfileModal
                    onClose={() => setIsProfileModalOpen(false)}
                    userId={user?.usuario_id}
                />
            )}
            {isProcedimientosModalOpen && (
                <ProcedimientosModal
                    onClose={() => setIsProcedimientosModalOpen(false)}
                />
            )}
            {isConsultarHistorialModalOpen && (
                <ConsultarHistorialModal
                    onClose={() => setIsConsultarHistorialModalOpen(false)}
                    userId={user?.usuario_id}
                    userRole={user.role}
                />
            )}
        </div>
    );
};

export default MainPage;