const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  empId: { type: String, required: true, unique: true },
  favTools: { type: [String], required: true },
  password: { type: String, required: true },

  // New profile fields
  firstName: { type: String },
  lastName: { type: String },
  dob: { type: String }, // Or Date if preferred
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  postcode: { type: String },
  country: { type: String },
  telephone: { type: String },
  mobile: { type: String },
  photo: { type: String } // Can store base64 or a URL
});

// Pre-save middleware to hash the password before saving
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password for login
employeeSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
