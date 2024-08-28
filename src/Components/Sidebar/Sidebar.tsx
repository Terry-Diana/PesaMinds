import React, { useState } from 'react';
import { gsap } from 'gsap';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (isCollapsed) {
      gsap.to('.sidebar', { x: -200, duration: 1 });
      gsap.to('.main-content', { marginLeft: 0, duration: 1 });
    } else {
      gsap.to('.sidebar', { x: 0, duration: 1 });
      gsap.to('.main-content', { marginLeft: 200, duration: 1 });
    }
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className="sidebar">
      <button className="collapse-button" onClick={toggleSidebar}>
        {isCollapsed ? '>' : '<'}
      </button>
      <ul>
        <li>Income</li>
        <li>Expenses</li>
        <li>Budget Overview</li>
        <li>Savings</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
