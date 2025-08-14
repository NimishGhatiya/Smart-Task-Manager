'use client';
import React, { useState } from 'react';
import { api } from '@/lib/api';

export default function AuthPage() {
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'signup') await api.signup(username, password);
      const { token, user } = await api.login(username, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/dashboard';
    } catch (e: any) { setError(e.message); }
  }

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <h2>{mode === 'login' ? 'Login' : 'Create Account'}</h2>
      <form onSubmit={submit} className="row">
        <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="badge" style={{ borderColor: '#ff5b5b', color:'#ff9b9b' }}>{error}</div>}
        <button className="button" type="submit">{mode === 'login' ? 'Login' : 'Sign up & Login'}</button>
        <button type="button" className="button secondary" onClick={()=>setMode(mode==='login'?'signup':'login')}>
          {mode==='login' ? 'Need an account? Sign up' : 'Have an account? Login'}
        </button>
      </form>
    </div>
  );
}
