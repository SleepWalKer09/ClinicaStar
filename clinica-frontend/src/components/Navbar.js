import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout, showAddSpecialist, onAddSpecialist, showConsultUsers, onConsultarUsuarios,onConsultUsers, onMiPerfilClick, userRole, onOpenProfileModal,onProcedimientosClick, onConsultarHistorial }) => {
    const navigate = useNavigate();

    const handleAddSpecialistClick = () => {
        onAddSpecialist();
    };

    const handleConsultarUsuariosClick = () => {
        onConsultarUsuarios();
    };

    const handleMiPerfilClick = () => {
        onMiPerfilClick();
    };

    return (
        <nav className="Navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f0f0f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <div>
                <span>Clínica Star Platinum</span>
            </div>
            <div>
                {showAddSpecialist && (
                    <button onClick={onAddSpecialist} style={{ marginRight: '10px' }}>Agregar Especialista</button>
                )}
                {userRole === 'Especialista' && (
                <>
                    <button onClick={onConsultarUsuarios} style={{ marginRight: '10px' }}>Consultar Usuarios</button>
                    <button onClick={onProcedimientosClick} style={{ marginRight: '10px' }}>Procedimientos</button>
                </>
                )}
                {(userRole === 'Especialista' || userRole === 'Paciente') && (
                    <button onClick={onConsultarHistorial} style={{ marginRight: '10px' }}>Consultar Historial</button>
                )}
                <button onClick={onOpenProfileModal}>Mi Perfil</button>
                <button onClick={onLogout}>Cerrar sesión</button>
            </div>
        </nav>
    );
};

export default Navbar;