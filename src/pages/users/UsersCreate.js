import React, { useState, useEffect, setError } from 'react';
import { CreateUser } from '../../controllers/UserController';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

export default function UsersCreate() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    CreateUser(user); 
    
    toast.success('User created successfully', {
        autoClose: 15000, 
      });

    setUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    });
  };

  return (
    <div className="careers">
      <h1>Create a New User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={user.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={user.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={user.phone}
          onChange={handleInputChange}
          required
        />
      </div>
        <div>
          <button type="submit">Create User</button>
        </div>
      </form>
    </div>
  );
}
