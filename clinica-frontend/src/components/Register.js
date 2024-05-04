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
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mb-3">Registro de Usuario</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="nombre" placeholder="Nombre" onChange={handleChange} value={formData.nombre} required />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="apellido" placeholder="Apellido" onChange={handleChange} value={formData.apellido} required />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" name="password" placeholder="Contraseña" onChange={handleChange} value={formData.password} required />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="phone" placeholder="Teléfono" onChange={handleChange} value={formData.phone} />
                        </div>
                        <div className="mb-3">
                            <input type="number" className="form-control" name="edad" placeholder="Edad" onChange={handleChange} value={formData.edad} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="genero" placeholder="Género" onChange={handleChange} value={formData.genero} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="direccion" placeholder="Dirección" onChange={handleChange} value={formData.direccion} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="aseguradora" placeholder="Aseguradora" onChange={handleChange} value={formData.aseguradora} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="alergias" placeholder="Alergias" onChange={handleChange} value={formData.alergias} />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Registrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;