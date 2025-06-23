const express = require('express');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const router = express.Router();

// Register (Create)
router.post('/', async (req, res) => {
  try {
    const exists = await Employee.findOne({ empId: req.body.empId });
    if (exists) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    const newEmployee = new Employee(req.body); // Full body includes profile fields
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
      _id: employee._id,
      name: employee.name,
      empId: employee.empId,
      designation: employee.designation,
      favTools: employee.favTools,
      firstName: employee.firstName,
      lastName: employee.lastName,
      dob: employee.dob,
      address1: employee.address1,
      address2: employee.address2,
      city: employee.city,
      state: employee.state,
      postcode: employee.postcode,
      country: employee.country,
      telephone: employee.telephone,
      mobile: employee.mobile,
      photo: employee.photo,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Get all employees (admin use)
router.get('/', async (_req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees', error: err.message });
  }
});

// Get single employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employee', error: err.message });
  }
});

// Update employee profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee updated successfully', employee: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating employee', error: err.message });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting employee', error: err.message });
  }
});

module.exports = router;
