// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

function Login({ setToken, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      if (isAdmin) {
        setToken('admin'); // token de admin
        setMessage('');
      } else {
        const res = await axios.post('http://localhost:8080/login', { email, password });
        setToken(res.data.token);
        setMessage('');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erro no login');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="auth-input" />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="auth-input" />
      
      <div style={{ margin: '10px 0' }}>
        <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} /> Login como admin
      </div>

      <button onClick={handleLogin} className="auth-button">Entrar</button>
      {message && <p className="auth-message">{message}</p>}
      <p style={{ marginTop: '10px' }}>
        Não tem conta? <span onClick={switchToRegister} style={{ color: 'blue', cursor: 'pointer' }}>Registrar</span>
      </p>
    </div>
  );
}

export default Login;
