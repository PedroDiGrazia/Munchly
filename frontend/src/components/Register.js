// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

function Register({ switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:8080/register', { email, password });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erro no registro');
    }
  };

  return (
    <div className="auth-container">
      <h2>Registrar Usuário</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="auth-input" />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="auth-input" />
      <button onClick={handleRegister} className="auth-button">Registrar</button>
      {message && <p className="auth-message">{message}</p>}
      <p style={{ marginTop: '10px' }}>
        Já tem conta? <span onClick={switchToLogin} style={{ color: 'blue', cursor: 'pointer' }}>Login</span>
      </p>
    </div>
  );
}

export default Register;
