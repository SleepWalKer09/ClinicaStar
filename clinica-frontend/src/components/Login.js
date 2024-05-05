import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState('');

    // Escucha los cambios en location.state para capturar el mensaje de éxito de registro
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Limpia el estado para evitar que el mensaje se muestre si el usuario navega fuera y regresa a login
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append('username', credentials.email);
        params.append('password', credentials.password);

        try {
            const response = await axios.post('http://localhost:8000/ClinicaStar/login', params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.role);
            navigate('/mainpage');
        } catch (error) {
            const errorMessage = error.response?.data?.detail?.msg || 'Error al iniciar sesión. Por favor, verifica tus credenciales y vuelve a intentarlo.';
            setError(errorMessage);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="col-md-4">
                <h2 className="mb-3 text-center">Iniciar Sesión</h2>
                {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="email" className="form-control" name="email" placeholder="Email" onChange={handleChange} value={credentials.email} required />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" name="password" placeholder="Contraseña" onChange={handleChange} value={credentials.password} required />
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;