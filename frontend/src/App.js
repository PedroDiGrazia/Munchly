// src/App.js
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Foods from './components/Foods';
import FoodSwipe from './components/FoodSwipe';

function App() {
  const [token, setToken] = useState(''); // JWT ou 'admin'
  const [view, setView] = useState('login'); // 'login', 'register', 'foods'

  const handleLoginSuccess = (jwt) => {
    setToken(jwt);
    setView('foods'); // Vai para tela de comidas
  };

  const switchToRegister = () => setView('register');
  const switchToLogin = () => setView('login');

  return (
    <div>
      {view === 'register' && <Register switchToLogin={switchToLogin} />}
      {view === 'login' && <Login setToken={handleLoginSuccess} switchToRegister={switchToRegister} />}
      {view === 'foods' && <FoodSwipe />}
    </div>
  );
}

export default App;
