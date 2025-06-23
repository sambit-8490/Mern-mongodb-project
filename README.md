# 👨‍💼 MERN Employee Portal

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application where employees can:

- Register with designation and favorite DevOps tools
- Log in using Employee ID and password
- View their personal dashboard
- Edit or update their own details
- Secure logout system

---

## 🔧 Features

- 🚀 Login & Registration (with password hashing using bcrypt)
- 🛡️ Protected dashboard (each employee sees only their own data)
- 🖋️ Update personal information
- 🗑️ Delete own profile (optional)
- 🎨 Clean, responsive UI with optional DevOps tools list

---

Run `docker-compose up -d`
- Visit:
  - **Frontend**: `http://localhost:3000`
  - **API**: `http://localhost:5000/api/employees`
  - **Admin Dashboard**: `http://localhost:5000/dashboard`
