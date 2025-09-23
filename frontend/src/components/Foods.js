// src/components/Foods.js
import React from 'react';
import './Foods.css';

function Foods() {
  // Lista estática de comidas
  const foods = [
    { id: 1, name: 'Pizza', link: 'https://www.ifood.com.br/' },
    { id: 2, name: 'Hambúrguer', link: 'https://www.rappi.com.br/' },
    { id: 3, name: 'Sushi', link: 'https://www.ifood.com.br/' },
    { id: 4, name: 'Açaí', link: 'https://www.rappi.com.br/' },
  ];

  return (
    <div className="foods-container">
      {foods.map(food => (
        <div key={food.id} className="food-card">
          <h3>{food.name}</h3>
          {food.link && (
            <a href={food.link} target="_blank" rel="noopener noreferrer" className="food-link">
              Ver no delivery
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export default Foods;
