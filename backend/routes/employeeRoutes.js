const express = require('express');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
  const { name, designation, empId, favTools, password } = req.body;
  try {
    const exists = await Employee.findOne({ empId });
    if (exists) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }
    const newEmployee = new Employee({ name, designation, empId, favTools, password });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving employee', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { empId, password } = req.body;
  try {
    const employee = await Employee.findOne({ empId });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    res.status(200).json({
      name: employee.name,
      empId: employee.empId,
      designation: employee.designation,
      favTools: employee.favTools,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Get all
router.get('/', async (_req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees', error: err.message });
  }
});

// Update any employee by ID
router.put('/:id', async (req, res) => {
  const { name, designation, empId, favTools } = req.body;
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, designation, empId, favTools },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee updated successfully', employee: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating', error: err.message });
  }
});

// Delete employee by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting', error: err.message });
  }
});

module.exports = router;
