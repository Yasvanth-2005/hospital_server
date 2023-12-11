import { Doctor } from '../models/Doctor.js';
import jwt from 'jsonwebtoken';
import { hash,compare } from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
  try {
    const { doctorName, phoneNumber, email, password, specifications } = req.body;

    // Check if the doctorId already exists
    const existingDoctor = await Doctor.findOne({ email: email });
    if (existingDoctor) {
      return res.status(400).json({ msg: 'Doctor already exists.' });
    }

    const hashedPassword = await hash(password, 10);

    // Create a new Doctor instance
    const newDoctor = new Doctor({
      doctorName: doctorName,
      phoneNumber: phoneNumber,
      email: email,
      password: hashedPassword,
      specifications: specifications,
    });

    const savedDoctor = await newDoctor.save();

    // Send email
    // await sendRegistrationEmail(email, doctorName);

    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendRegistrationEmail = async (toEmail, doctorName) => {
  const transporter = nodemailer.createTransport({
    // Configure your email service
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'n200081@rguktn.ac.in',
    to: toEmail,
    subject: 'Registration Successful',
    text: `Dear ${doctorName},\n\nThank you for registering as a doctor.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export const login = async (req, res) => {
  
  
  try {
    const { doctorId, password } = req.body;
    
    if (doctorId === process.env.ADMINNAME && password === process.env.ADMINPASS) {
      return res.status(200).json({ message: "Successfully logged in as admin" });
    }
    
    const doctor = await Doctor.findOne({ doctorId: doctorId });
    
    if (!doctor) {
      return res.status(400).json({ msg: " SOrry Doctor does not exist." });
    }
    
    const isMatch = await compare(password, doctor.password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    delete doctor.password;
    res.status(200).json({ token, doctor });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
