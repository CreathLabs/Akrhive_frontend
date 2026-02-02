import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('https://akrhivebackend-production.up.railway.app//api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Login successful") {
          navigate('/admin/dashboard');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="bg-white p-8 rounded-sm shadow-xl w-full max-w-md border-t-4 border-ark-gold">
        <h2 className="font-serif text-2xl text-center mb-6 text-ark-dark">Admin Access</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 focus:outline-none focus:border-ark-gold"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 focus:outline-none focus:border-ark-gold"
              placeholder="••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-ark-dark text-white py-3 font-bold uppercase tracking-widest hover:bg-ark-gold hover:text-ark-dark transition-colors"
          >
            Enter Dashboard
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">Internal Authorization Only</p>
      </div>
    </div>
  );
};

export default AdminLogin;