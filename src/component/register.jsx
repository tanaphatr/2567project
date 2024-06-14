import React, { useState } from 'react';
import bcrypt from 'bcryptjs'; // Importing bcryptjs library
import './login.css'; // Assuming you have a CSS file for styling

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();

    const namePattern = /^[a-zA-Z]+$/;
    if (!namePattern.test(name)) {
      alert('Name must contain only letters (a-z, A-Z)');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const userResponse = await fetch('http://localhost:3001/User');
      const users = await userResponse.json();

      const userExists = users.some(user => user.Username === username);

      if (userExists) {
        alert('Username already exists');
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10); 

      const data = {
        name: name,
        email: email,
        username: username,
        password: hashedPassword, 
      };

      const response = await fetch('http://localhost:3001/InUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Registration successful!');
      // Redirect user to home page
      window.location.href = '/login';
    } catch (error) {
      console.error('There was a problem with registration:', error);
    }
  };

  return (
    <div>
      <div className="center">
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Register</h1>
        <form onSubmit={handleRegistration}>
          <div className="txt_field">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Name</label>
          </div>
          <div className="txt_field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>
          <div className="txt_field">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Username</label>
          </div>
          <div className="txt_field">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>
          <div className="txt_field">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm password</label>
          </div>
          <button type="submit">Register</button>
          <br />
          <br />
          <div className="signup_link">
            Already a member?{' '}
            <a className="link" onClick={() => window.location.href = "/login"}>
              Login
            </a>
          </div>
          <br />
        </form>
      </div>
    </div>
  );
}

export default Register;