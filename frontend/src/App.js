import React, { useState } from 'react';
import './App.css';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function App() {
  const [mode, setMode] = useState('login'); // login, register, profile
  const [form, setForm] = useState({
    name: '', empId: '', designation: '', favTools: [], password: ''
  });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const designations = [
    "DevOps Engineer", "Junior DevOps Engineer", "Senior DevOps Engineer",
    "Lead DevOps Engineer", "DevOps Manager", "Site Reliability Engineer (SRE)",
    "Cloud Engineer", "Junior Cloud Engineer", "Senior Cloud Engineer",
    "Cloud Support Engineer", "Cloud DevOps Engineer", "AWS DevOps Engineer"
  ];

  const tools = [
    "Git", "GitHub", "GitLab", "Bitbucket", "Jenkins", "Docker",
    "Kubernetes", "Ansible", "Terraform", "Prometheus", "Grafana"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleToolsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, o => o.value);
    setForm(prev => ({ ...prev, favTools: selected }));
  };

  const register = async () => {
    setMessage('');
    const res = await fetch(`${API}/api/employees`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMessage(data.message || 'Registration successful!');
    if (res.ok) setMode('login');
  };

  const login = async () => {
    setMessage('');
    const res = await fetch(`${API}/api/employees/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empId: form.empId, password: form.password })
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data);
      setMode('profile');
    } else {
      setMessage(data.message);
    }
  };

  const logout = () => {
    setUser(null);
    setMode('login');
    setForm({ name: '', empId: '', designation: '', favTools: [], password: '' });
    setMessage('');
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setUser(u => ({ ...u, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setMessage('');
    const { _id, password, ...payload } = user;
    const res = await fetch(`${API}/api/employees/${user._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.employee);
      setMessage('Profile saved successfully!');
    } else {
      setMessage(data.message || 'Save failed');
    }
  };

  return (
    <div className="app">
      <h1>Employee Portal</h1>

      {(mode === 'login' || mode === 'register') && (
        <div className="form-box">
          {mode === 'register' && (
            <>
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
              <select name="designation" value={form.designation} onChange={handleChange}>
                <option value="">Designation</option>
                {designations.map(d => <option key={d}>{d}</option>)}
              </select>
              <select multiple value={form.favTools} onChange={handleToolsChange}>
                {tools.map(t => <option key={t}>{t}</option>)}
              </select>
            </>
          )}

          <input name="empId" placeholder="Employee ID" value={form.empId} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

          <div className="btn-group">
            <button onClick={mode === 'login' ? login : register}>
              {mode === 'login' ? 'Login' : 'Register'}
            </button>
            <button onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setMessage('');
            }}>
              Switch to {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </div>

          {message && <div className="msg">{message}</div>}
        </div>
      )}

      {mode === 'profile' && user && (
        <div className="profile-box">
          <div className="profile-header">
            <h2>Edit Profile</h2>
            <button onClick={logout}>Logout</button>
          </div>

          <div className="photo-section">
            <img src={user.photo || '/default-avatar.png'} alt="Profile" />
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </div>

          <div className="profile-fields">
            <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} placeholder="Name" />
            <input value={user.empId} disabled />
            <select value={user.designation} onChange={e => setUser({...user, designation: e.target.value})}>
              <option value="">Designation</option>
              {designations.map(d => <option key={d}>{d}</option>)}
            </select>

            <select multiple value={user.favTools} onChange={e => {
              const sel = Array.from(e.target.selectedOptions, o => o.value);
              setUser({...user, favTools: sel});
            }}>
              {tools.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <button className="save-btn" onClick={saveProfile}>Save Profile</button>
          {message && <div className="msg">{message}</div>}
        </div>
      )}
    </div>
  );
}

export default App;
