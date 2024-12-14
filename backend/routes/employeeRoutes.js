const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing and comparison
const Employee = require('../models/Employee'); // Import the Employee model

const router = express.Router();

// POST request to create a new employee
router.post('/', async (req, res) => {
  const { name, designation, empId, favTools, password } = req.body;

  // Log the incoming data
  console.log('Received data:', req.body);

  try {
    const newEmployee = new Employee({
      name,
      designation,
      empId,
      favTools,
      password, // Password will be hashed automatically in the Employee model using pre-save middleware
    });

    const savedEmployee = await newEmployee.save();
    console.log('Employee saved:', savedEmployee);

    res.status(201).json({ message: 'Employee details saved successfully!', employee: savedEmployee });
  } catch (error) {
    console.error('Error saving employee:', error);
    res.status(500).json({ message: 'Error saving employee details', error: error.message });
  }
});

// POST request to authenticate employee login
router.post('/login', async (req, res) => {
  const { empId, password } = req.body;

  try {
    // Find employee by empId
    const employee = await Employee.findOne({ empId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Compare the password with the stored hash using bcrypt
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Respond with employee data if login is successful
    res.status(200).json({
      name: employee.name,
      empId: employee.empId,
      designation: employee.designation,
      favTools: employee.favTools,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// GET request to fetch all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employee details', error: error.message });
  }
});

module.exports = router;
