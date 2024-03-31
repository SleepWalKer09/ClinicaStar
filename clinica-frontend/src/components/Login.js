import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append('username', credentials.email);
        params.append('password', credentials.password);
    
        try {
            const response = await axios.post('http://localhost:8000/login', params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.role); // Asegúrate de almacenar el rol aquí
            navigate('/MainPage');
        } catch (error) {
            const errorMessage = error.response?.data?.detail?.msg || 'Error al iniciar sesión. Por favor, verifica tus credenciales y vuelve a intentarlo.';
            setError(errorMessage);
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} value={credentials.email} required />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} value={credentials.password} required />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;