import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();
    
        const handleRegisterClick = () => {
        navigate('/register');
        };
    
        const handleLoginClick = () => {
        navigate('/login');
        };
    
    return (
        <div className="welcome-section">
        <div>
            <img src="/images/LogoClinica.png" alt="Logo" />
            <h1 className="clinic-title">Clínica Star Platinum</h1>
            <p className="clinic-slogan">Risus noster stella!</p>
            </div>
            <p className="welcome-text">Bienvenido, agenda ahora una cita con uno de nuestros especialistas, con mucho gusto te atenderemos pues tu sonrisa es nuestra estrella.</p>
            <p className="welcome-text">¿No tienes cuenta? Aquí puedes registrarte</p>
            <div className="buttons-container">
            <button onClick={handleRegisterClick}>Registrarse</button>
            <button onClick={handleLoginClick}>Iniciar sesión</button>
            </div>
        </div>
    );
};

export default WelcomePage;
