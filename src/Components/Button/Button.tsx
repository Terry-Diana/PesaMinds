import React from 'react';
import './Button.css';

const Button: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => {
  return <button className="custom-button" onClick={onClick}>{text}</button>;
};

export default Button;
