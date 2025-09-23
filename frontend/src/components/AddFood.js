// src/components/AddFood.js
import React, { useState } from 'react';
import './Foods.css';

function AddFood({ addFood }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    addFood({ name, link });
    setName('');
    setLink('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-food-form">
      <h3>Adicionar nova comida</h3>
      <input type="text" placeholder="Nome da comida" value={name} onChange={e => setName(e.target.value)} className="food-input"/>
      <input type="text" placeholder="Link para delivery (opcional)" value={link} onChange={e => setLink(e.target.value)} className="food-input"/>
      <button type="submit" className="food-button">Adicionar</button>
    </form>
  );
}

export default AddFood;
