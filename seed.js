// ============================================================
// seed.js — Populate database with sample data
// Run: node seed.js
// ============================================================
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vbu_db';

// Schemas
const courseSchema = new mongoose.Schema({ title:String,department:String,level:String,duration:String,totalSeats:Number,description:String,eligibility:String,fees:Number,isActive:Boolean,tags:[String] });
const facultySchema = new mongoose.Schema({ name:String,designation:String,department:String,qualification:String,experience:Number,specialization:String,researchInterests:[String],publications:Number,email:String,isActive:Boolean });

const Course  = mongoose.model('Course',  courseSchema);
const Faculty = mongoose.model('Faculty', facultySchema);

const SAMPLE_COURSES = [
  { title:'B.Tech Computer Science & Engineering', department:'Engineering', level:'UG', duration:'4 Years', totalSeats:120, description:'Covers algorithms, AI/ML, cloud, full-stack dev.', eligibility:'12th PCM with 60%+ or JEE score', fees:85000, isActive:true, tags:['AI','Cloud','Popular'] },
  { title:'B.Tech Electronics & Communication', department:'Engineering', level:'UG', duration:'4 Years', totalSeats:90, description:'VLSI, embedded systems, signal processing, 5G.', eligibility:'12th PCM with 60%+ or JEE score', fees:85000, isActive:true, tags:['VLSI','IoT'] },
  { title:'B.Tech Mechanical Engineering', department:'Engineering', level:'UG', duration:'4 Years', totalSeats:90, description:'Robotics, CAD/CAM, thermal engineering.', eligibility:'12th PCM with 60%+ or JEE score', fees:80000, isActive:true, tags:['Robotics','Design'] },
  { title:'B.Tech Civil Engineering', department:'Engineering', level:'UG', duration:'4 Years', totalSeats:60, description:'Structural, transportation, water resources.', eligibility:'12th PCM with 60%+ or JEE score', fees:75000, isActive:true, tags:['Infra','Sustainable'] },
  { title:'MBA – Business Administration', department:'Management', level:'PG', duration:'2 Years', totalSeats:60, description:'Strategy, finance, marketing, entrepreneurship.', eligibility:'Graduation + CAT/MAT score', fees:120000, isActive:true, tags:['Finance','Leadership'] },
  { title:'M.Tech Artificial Intelligence', department:'Engineering', level:'PG', duration:'2 Years', totalSeats:30, description:'Deep learning, NLP, computer vision, AI ethics.', eligibility:'B.Tech CSE/ECE with GATE score', fees:100000, isActive:true, tags:['AI','Research','New'] },
  { title:'B.Sc Mathematics & Statistics', department:'Science', level:'UG', duration:'3 Years', totalSeats:60, description:'Pure math, statistics, data analysis.', eligibility:'12th PCM with 55%+', fees:45000, isActive:true, tags:['Research','Data'] },
  { title:'Ph.D Computer Science', department:'Engineering', level:'PhD', duration:'3–5 Years', totalSeats:20, description:'Advanced research in AI, cybersecurity, systems.', eligibility:'M.Tech/MSc with 60%+ and research proposal', fees:50000, isActive:true, tags:['Research','Funded'] },
  { title:'B.Com Commerce & Finance', department:'Management', level:'UG', duration:'3 Years', totalSeats:90, description:'Accounting, taxation, financial management.', eligibility:'12th Commerce/PCM with 55%+', fees:40000, isActive:true, tags:['Finance','CPA'] },
];

const SAMPLE_FACULTY = [
  { name:'Dr. Priya Nair', designation:'Professor', department:'Computer Science & Engineering', qualification:'PhD – IIT Madras', experience:18, specialization:'Artificial Intelligence & Machine Learning', researchInterests:['Deep Learning','NLP','Computer Vision'], publications:42, email:'priya.nair@vbu.ac.in', isActive:true },
  { name:'Prof. Suresh Kumar', designation:'Professor', department:'Electronics & Communication', qualification:'PhD – IISc Bangalore', experience:22, specialization:'VLSI Design & Embedded Systems', researchInterests:['VLSI','IoT','Signal Processing'], publications:58, email:'suresh.kumar@vbu.ac.in', isActive:true },
  { name:'Dr. Meena Krishnan', designation:'Associate Professor', department:'Mathematics', qualification:'PhD – TIFR Mumbai', experience:15, specialization:'Number Theory & Cryptography', researchInterests:['Algebraic Number Theory','Cryptography'], publications:31, email:'meena.k@vbu.ac.in', isActive:true },
  { name:'Prof. Ramesh Pillai', designation:'Professor', department:'Mechanical Engineering', qualification:'PhD – IIT Bombay', experience:20, specialization:'Robotics & Automation', researchInterests:['Robotics','Manufacturing','CAD/CAM'], publications:47, email:'ramesh.pillai@vbu.ac.in', isActive:true },
  { name:'Dr. Kavitha Raman', designation:'Associate Professor', department:'Business Management', qualification:'PhD – IIM Ahmedabad', experience:16, specialization:'Strategic Management', researchInterests:['Corporate Strategy','Innovation','Entrepreneurship'], publications:28, email:'kavitha.r@vbu.ac.in', isActive:true },
  { name:'Prof. Anand Sharma', designation:'Professor', department:'Civil Engineering', qualification:'PhD – IIT Delhi', experience:24, specialization:'Structural Analysis', researchInterests:['Structural Engineering','Earthquake Engineering'], publications:61, email:'anand.sharma@vbu.ac.in', isActive:true },
];

async function seedDB() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Course.deleteMany({});
  await Faculty.deleteMany({});
  console.log('Cleared existing data');

  await Course.insertMany(SAMPLE_COURSES);
  console.log(`✅ Inserted ${SAMPLE_COURSES.length} courses`);

  await Faculty.insertMany(SAMPLE_FACULTY);
  console.log(`✅ Inserted ${SAMPLE_FACULTY.length} faculty members`);

  await mongoose.disconnect();
  console.log('✅ Database seeded successfully!');
}

seedDB().catch(console.error);
