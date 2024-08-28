import React from 'react';
import './GameCard.css';

const GameCard: React.FC<{ title: string }> = ({ title }) => {
  return <div className="game-card">{title}</div>;
};

export default GameCard;
