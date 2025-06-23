import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    designation: '',
    favTools: '',
    password: '',
  });
  const [loggedInEmployee, setLoggedInEmployee] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [editedData, setEditedData] = useState({});

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    if (loggedInEmployee) fetchEmployees();
  }, [loggedInEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, favTools: formData.favTools.split(',') }),
      });
      const data = await res.json();
      setResponseMessage(data.message || 'Registered');
      setFormData({ name: '', empId: '', designation: '', favTools: '', password: '' });
    } catch (err) {
      setResponseMessage('Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/employees/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empId: formData.empId, password: formData.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedInEmployee(data);
        setResponseMessage('');
        setFormData({ name: '', empId: '', designation: '', favTools: '', password: '' });
      } else {
        setResponseMessage(data.message);
      }
    } catch (err) {
      setResponseMessage('Login error');
    }
  };

  const handleLogout = () => {
    setLoggedInEmployee(null);
    setEmployees([]);
    setFormData({ name: '', empId: '', designation: '', favTools: '', password: '' });
    setResponseMessage('');
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/api/employees`);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/employees/${id}`, { method: 'DELETE' });
      fetchEmployees();
    } catch (err) {
      console.error('Delete failed');
    }
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditedData({ ...employees[index], favTools: employees[index].favTools.join(',') });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    try {
      await fetch(`${API_URL}/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editedData, favTools: editedData.favTools.split(',') }),
      });
      setEditIndex(-1);
      fetchEmployees();
    } catch (err) {
      console.error('Update failed');
    }
  };

  return (
    <div className="app">
      <div className="header">Employee Portal</div>

      {!loggedInEmployee && (
        <div className="formContainer">
          <input name="empId" placeholder="Employee ID" value={formData.empId} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />

          {!isLoginMode && (
            <>
              <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
              <input name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} />
              <input name="favTools" placeholder="Favorite Tools (comma separated)" value={formData.favTools} onChange={handleChange} />
            </>
          )}

          <div className="buttonGroup">
            <button className="button" onClick={isLoginMode ? handleLogin : handleRegister}>
              {isLoginMode ? 'Login' : 'Register'}
            </button>
            <button className="button" onClick={() => setIsLoginMode(!isLoginMode)}>
              {isLoginMode ? 'Create Account' : 'Switch to Login'}
            </button>
          </div>

          {responseMessage && <div className="responseMessage">{responseMessage}</div>}
        </div>
      )}

      {loggedInEmployee && (
        <div className="welcomeContainer">
          <h2>Welcome, {loggedInEmployee.name} ({loggedInEmployee.empId})</h2>
          <button className="button" onClick={handleLogout}>Logout</button>

          <table className="detailsTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Emp ID</th>
                <th>Designation</th>
                <th>Favorite Tools</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp._id}>
                  {editIndex === index ? (
                    <>
                      <td><input name="name" value={editedData.name} onChange={handleEditChange} /></td>
                      <td><input name="empId" value={editedData.empId} onChange={handleEditChange} /></td>
                      <td><input name="designation" value={editedData.designation} onChange={handleEditChange} /></td>
                      <td><input name="favTools" value={editedData.favTools} onChange={handleEditChange} /></td>
                      <td>
                        <button className="editBtn" onClick={() => saveEdit(emp._id)}>Save</button>
                        <button className="deleteBtn" onClick={() => setEditIndex(-1)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{emp.name}</td>
                      <td>{emp.empId}</td>
                      <td>{emp.designation}</td>
                      <td>{emp.favTools.join(', ')}</td>
                      <td>
                        <button className="editBtn" onClick={() => startEdit(index)}>Edit</button>
                        <button className="deleteBtn" onClick={() => handleDelete(emp._id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
