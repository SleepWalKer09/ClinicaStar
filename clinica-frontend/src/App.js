import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import Register from './components/Register';
import Login from './components/Login';
import MainPage from './components/MainPage';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  const handleLogin = async (email, password) => {
    try {
        const { data } = await axios.post('/login', { email, password });
        // Almacenar el token JWT y el rol del usuario en el almacenamiento local
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.role); // Guarda el rol del usuario
        
        setIsLoggedIn(true);
        // Asumiendo que quieres almacenar más datos del usuario en el estado, ajusta setUser según sea necesario
        setUser({
            email, // Email del usuario
            role: data.role, // Rol del usuario
        });
        setLoginModalOpen(false);
        
        // Opcionalmente, podrías querer navegar a otra página aquí si es parte del flujo de tu app
        // navigate('/some-path');
    } catch (error) {
        console.error('Login failed:', error.response?.data?.detail || 'An error occurred during login');
        // Aquí podrías manejar errores específicos de login y mostrar mensajes al usuario si es necesario
    }
};

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} exact />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/MainPage" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
