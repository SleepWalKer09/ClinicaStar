import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        rol: 'Paciente',
        phone: '',
        password: '',
        edad: '',
        genero: '',
        direccion: '',
        aseguradora: '',
        alergias: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/create_usuarios/', formData);
            navigate('/login', { state: { message: 'Registro exitoso. Por favor, inicie sesión con su nueva cuenta.' } });
        } catch (error) {
            setError(error.response?.data?.detail || 'Error al registrar el usuario.');
        }
    };

    return (
        <div>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} value={formData.nombre} required />
                <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} value={formData.apellido} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} value={formData.password} required />
                <input type="text" name="phone" placeholder="Teléfono" onChange={handleChange} value={formData.phone} />
                <input type="number" name="edad" placeholder="Edad" onChange={handleChange} value={formData.edad} /> 
                <input type="text" name="genero" placeholder="Género" onChange={handleChange} value={formData.genero} /> 
                <input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} value={formData.direccion} />
                <input type="text" name="aseguradora" placeholder="Aseguradora" onChange={handleChange} value={formData.aseguradora} />
                <input type="text" name="alergias" placeholder="Alergias" onChange={handleChange} value={formData.alergias} />
                <button type="submit">Registrar</button>
            </form>
            </div>
        );
    };
    
    export default Register;