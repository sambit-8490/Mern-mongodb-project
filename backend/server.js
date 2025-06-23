const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const employeeRoutes = require('./routes/employeeRoutes');
const Employee = require('./models/Employee');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
app.use('/api/employees', employeeRoutes);

// Admin HTML Dashboard
app.get('/dashboard', async (req, res) => {
  try {
    const employees = await Employee.find();
    const rows = employees.map(emp => `
      <tr id="row-${emp._id}">
        <td><input class="name" data-id="${emp._id}" value="${emp.name}" /></td>
        <td><input class="empId" data-id="${emp._id}" value="${emp.empId}" /></td>
        <td><input class="designation" data-id="${emp._id}" value="${emp.designation}" /></td>
        <td><input class="favTools" data-id="${emp._id}" value="${emp.favTools.join(', ')}" /></td>
        <td>
          <button onclick="doEdit('${emp._id}')">💾 Save</button>
          <button onclick="doDelete('${emp._id}')">🗑️ Delete</button>
        </td>
      </tr>
    `).join('');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Employee Dashboard</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          th, td { padding: 12px; border: 1px solid #ddd; }
          th { background-color: #f0f0f0; }
          input { width: 100%; padding: 6px; }
          button { padding: 6px 12px; margin: 2px; cursor: pointer; }
          button:hover { opacity: 0.85; }
        </style>
      </head>
      <body>
        <h2>Employee Dashboard</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Emp ID</th>
              <th>Designation</th>
              <th>Fav Tools</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <script>
          async function doEdit(id) {
            const row = document.getElementById('row-' + id);
            const name = row.querySelector('.name').value.trim();
            const empId = row.querySelector('.empId').value.trim();
            const designation = row.querySelector('.designation').value.trim();
            const favTools = row.querySelector('.favTools').value.split(',').map(tool => tool.trim()).filter(Boolean);

            const res = await fetch('/api/employees/' + id, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, empId, designation, favTools })
            });

            const data = await res.json();
            if (res.ok) {
              alert('✅ Employee updated');
            } else {
              alert('❌ Update failed: ' + data.message);
            }
          }

          async function doDelete(id) {
            if (!confirm('Are you sure you want to delete this employee?')) return;

            const res = await fetch('/api/employees/' + id, { method: 'DELETE' });
            const data = await res.json();

            if (res.ok) {
              document.getElementById('row-' + id).remove();
              alert('🗑️ Employee deleted');
            } else {
              alert('❌ Delete failed: ' + data.message);
            }
          }
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('❌ Error loading dashboard');
  }
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
