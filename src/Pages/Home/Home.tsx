import React from 'react';
import Header from '../../Components/Header/Header';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Header />
      <h1>Welcome to Pesa-Minds</h1>
    </div>
  );
};

export default Home;
