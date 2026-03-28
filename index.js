// ============================================================
// routes/admissions.js
// ============================================================
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Inline schema (single-file for simplicity; split in production)
const Admission = mongoose.model('Admission') || require('../models').Admission;

// Validation helper
function validateAdmission(data) {
  const errors = [];
  if (!data.firstName?.trim()) errors.push('First name is required');
  if (!data.lastName?.trim())  errors.push('Last name is required');
  if (!data.email?.match(/^\S+@\S+\.\S+$/)) errors.push('Valid email required');
  if (!data.phone?.trim())     errors.push('Phone number is required');
  if (!['UG','PG','PhD'].includes(data.level)) errors.push('Invalid program level');
  if (!data.department?.trim()) errors.push('Department is required');
  return errors;
}

// POST /api/admissions — Submit new application
router.post('/', async (req, res) => {
  try {
    const errors = validateAdmission(req.body);
    if (errors.length) return res.status(400).json({ success: false, errors });

    const admission = new Admission({
      firstName:    req.body.firstName,
      lastName:     req.body.lastName,
      email:        req.body.email,
      phone:        req.body.phone,
      level:        req.body.level,
      department:   req.body.department,
      marks12th:    req.body.marks12th,
      entranceScore:req.body.entranceScore,
      message:      req.body.message,
    });

    await admission.save();
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will contact you within 24 hours.',
      data: { id: admission._id, name: `${admission.firstName} ${admission.lastName}` }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admissions — List all (admin protected in real app)
router.get('/', async (req, res) => {
  try {
    const { page=1, limit=20, status } = req.query;
    const filter = status ? { status } : {};
    const admissions = await Admission.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Admission.countDocuments(filter);
    res.json({ success: true, data: admissions, total, page: +page, pages: Math.ceil(total/limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admissions/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!admission) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: admission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;


// ============================================================
// routes/contact.js
// ============================================================
const contactRouter = express.Router();
const Contact = mongoose.model('Contact') || (() => {
  const s = new mongoose.Schema({ name: String, email: String, phone: String, subject: String, message: String, isRead: { type: Boolean, default: false } }, { timestamps: true });
  return mongoose.model('Contact', s);
})();

contactRouter.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ success: false, message: 'All fields are required' });
    const contact = new Contact({ name, email, phone, subject, message });
    await contact.save();
    res.status(201).json({ success: true, message: 'Message received! We will respond within 2 business hours.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

contactRouter.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts, total: contacts.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = contactRouter;


// ============================================================
// routes/courses.js
// ============================================================
const coursesRouter = express.Router();
const courseSchema = new mongoose.Schema({
  title: String, department: String, level: { type: String, enum: ['UG','PG','PhD'] },
  duration: String, totalSeats: Number, description: String, eligibility: String,
  fees: Number, isActive: { type: Boolean, default: true }, icon: String, tags: [String],
}, { timestamps: true });
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

// GET /api/courses — Get all courses with optional filters
coursesRouter.get('/', async (req, res) => {
  try {
    const { level, department, search } = req.query;
    const filter = { isActive: true };
    if (level) filter.level = level;
    if (department) filter.department = new RegExp(department, 'i');
    if (search) filter.title = new RegExp(search, 'i');
    const courses = await Course.find(filter).sort({ department: 1 });
    res.json({ success: true, data: courses, total: courses.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/courses (admin)
coursesRouter.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = coursesRouter;


// ============================================================
// routes/faculty.js
// ============================================================
const facultyRouter = express.Router();
const facultySchema = new mongoose.Schema({
  name: String, designation: String, department: String, qualification: String,
  experience: Number, specialization: String, researchInterests: [String],
  publications: { type: Number, default: 0 }, email: String, photo: String,
  linkedin: String, isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);

// GET /api/faculty
facultyRouter.get('/', async (req, res) => {
  try {
    const { department, designation } = req.query;
    const filter = { isActive: true };
    if (department) filter.department = new RegExp(department, 'i');
    if (designation) filter.designation = designation;
    const faculty = await Faculty.find(filter).sort({ department: 1, name: 1 });
    res.json({ success: true, data: faculty, total: faculty.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/faculty (admin)
facultyRouter.post('/', async (req, res) => {
  try {
    const member = new Faculty(req.body);
    await member.save();
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = facultyRouter;


// ============================================================
// routes/auth.js — Basic JWT Auth for Admin
// ============================================================
const authRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, default: 'admin' }, isActive: { type: Boolean, default: true }
}, { timestamps: true });
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email, isActive: true });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'vbu_secret_key_2025', { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/register (first-time setup)
authRouter.post('/register', async (req, res) => {
  try {
    const existingCount = await User.countDocuments();
    if (existingCount > 0) return res.status(403).json({ success: false, message: 'Admin already exists' });
    const user = new User({ name: req.body.name, email: req.body.email, password: req.body.password, role: 'superadmin' });
    await user.save();
    res.status(201).json({ success: true, message: 'Admin created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Auth middleware (for protected routes)
authRouter.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'vbu_secret_key_2025');
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authRouter;
