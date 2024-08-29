import React from 'react';
import { supabase } from '../../../Services/supabaseClient';
import './SignOut.css';

const Signout: React.FC = () => {
  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      console.log('Signed out successfully!');
      window.location.href = '/login'; 
    }
  };

  return (
    <button className="logout-button" onClick={handleSignout}>
      Sign Out
    </button>
  );
};

export default Signout;
