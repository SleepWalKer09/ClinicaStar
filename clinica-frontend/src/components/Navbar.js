import React from 'react';
//import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout, showAddSpecialist, onAddSpecialist, showConsultUsers, onConsultarUsuarios,onConsultUsers, onMiPerfilClick, userRole, onOpenProfileModal,onProcedimientosClick, onConsultarHistorial }) => {
    // const navigate = useNavigate();

    // const handleAddSpecialistClick = () => {
    //     onAddSpecialist();
    // };

    // const handleConsultarUsuariosClick = () => {
    //     onConsultarUsuarios();
    // };

    // const handleMiPerfilClick = () => {
    //     onMiPerfilClick();
    // };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <label>Clínica Star Platinum</label>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {showAddSpecialist && (
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={onAddSpecialist}>Agregar Especialista</button>
                            </li>
                        )}
                        {userRole === 'Especialista' && (
                            <>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={onConsultarUsuarios}>Consultar Usuarios</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={onProcedimientosClick}>Procedimientos</button>
                                </li>
                            </>
                        )}
                        {(userRole === 'Especialista' || userRole === 'Paciente') && (
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={onConsultarHistorial}>Consultar Historial</button>
                            </li>
                        )}
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={onOpenProfileModal}>Mi Perfil</button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={onLogout}>Cerrar sesión</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;