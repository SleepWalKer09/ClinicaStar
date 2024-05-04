import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoClinica from '../images/LogoClinica.png';

const WelcomePage = () => {
    const navigate = useNavigate();
    
        const handleRegisterClick = () => {
        navigate('/register');
        };
    
        const handleLoginClick = () => {
        navigate('/login');
        };
    
        return (
            <div className="container mt-5">
                <div className="text-center mb-4">
                    <img src={logoClinica} alt="Logo" />
                    <h1 className="mt-3">Clínica Star Platinum</h1>
                    <p className="lead">Risus noster stella!</p>
                </div>
                <div className="text-center mb-3">
                    <p>Bienvenido, agenda ahora una cita con uno de nuestros especialistas, con mucho gusto te atenderemos pues tu sonrisa es nuestra estrella.</p>
                    <p className="mb-4">¿No tienes cuenta? Aquí puedes registrarte.</p>
                </div>
                <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-info" onClick={handleRegisterClick}>Registrarse</button>
                    <button className="btn btn-primary" onClick={handleLoginClick}>Iniciar sesión</button>
                </div>
            </div>
        );
    };

export default WelcomePage;
