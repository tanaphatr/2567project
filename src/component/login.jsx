import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // Importing bcryptjs library
import './login.css';
import Nav from './nav';

function Login() {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/User');
      const userData = await response.json();

      const user = userData.find((user) => user.Username === usernameInput);
      
      if (user) {
        // Compare hashed password
        const passwordMatch = await bcrypt.compare(passwordInput, user.Password);

        if (passwordMatch) {
          console.log('Login successful!');

          // Store username and userid in local storage
          localStorage.setItem('username', user.Name);
          localStorage.setItem('userid', user.Userid);

          // Redirect to home page
          window.location.href = '/';
        } else {
          setError('Username or password is incorrect');
        }
      } else {
        setError('Username or password is incorrect');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error logging in. Please try again later.');
    }
  };

  return (
    <div>
      <Nav />
      <div className="center">
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="txt_field">
            <input
              type="text"
              value={usernameInput}
              required
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            <label>Username</label>
          </div>
          <div className="txt_field">
            <input
              type="password"
              value={passwordInput}
              required
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <label>Password</label>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
          <br />
          <br />
          <div className="signup_link">
            Not a member?{' '}
            <Link to="/register" className="text-black">
              Register
            </Link>
          </div>
          <br />
        </form>
      </div>
    </div>
  );
}

export default Login;
