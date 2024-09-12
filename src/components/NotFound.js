import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../jaymar-logo.png'; // Update this path if your logo is elsewhere
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <img src={logo} alt="JayMar Darts Logo" className="not-found-logo" />
      <h1>Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="home-button">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
