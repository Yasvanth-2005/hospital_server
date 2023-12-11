// Import necessary modules and models
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { Patient } from "./models/Patitent.js";
import { Prescription } from "./models/Patitent.js"; // Ensure you have the correct import path for Prescription
import authRoutes from "./routes/auth.js";
import { Doctor } from "./models/Doctor.js";

dotenv.config();
const app = express();

const port = process.env.PORT;
app.use(helmet());
// Middleware for parsing request body
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
app.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Find the doctor by doctorId
    const doctor = await Doctor.findOne({ doctorId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    
    return res.status(200).json(doctor);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Endpoint to create a new patient
app.post("/patients", async (req, res) => {
  try {
    // Extract patient information from the request body
    const { patientName, age, gender, blood } = req.body;

    // Generate a unique patientId
    let patientId;
    let isDuplicateId = true;

    while (isDuplicateId) {
      patientId = `P${Math.floor(1000 + Math.random() * 9000)}`; // Example: P1234

      // Check if patientId is already in use
      const existingPatient = await Patient.findOne({ patientId });
      isDuplicateId = !!existingPatient;
    }

    // Create a new patient instance
    const newPatient = new Patient({
      patientId,
      patientName,
      age,
      gender,
      blood,
    });

    // Save the new patient to the database
    await newPatient.save();

    // Respond with the newly created patient data
    return res.status(201).json(newPatient);
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Endpoint to get patient by custom ID
app.get("/patients/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    // Find the patient by custom ID
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json(patient);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.post("/patients/:patientId/prescriptions", async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const { doctorName, problem, description, medicine } = req.body;
    const doctor = await Doctor.findOne({ doctorName });
    if (!doctor) {
      return res.status(404).json({ message: "Doctorksdc not found" });
    }
    const newPrescription = new Prescription({
      doctorName,
      patientId:patientId,
      problem,
      description,
      medicine,
    });

    // Save the new prescription
    await newPrescription.save();

    // Add the prescription to the patient's prescriptions array
    patient.prescriptions.push(newPrescription);
    doctor. prescriptions.push(newPrescription);
    // Save the updated patient document
    await patient.save();
    await doctor.save();
    return res.status(201).json({
      prescription: newPrescription,
      patient: {
        patientId: patient.patientId,
        patientName: patient.patientName,
        age: patient.age,
        gender: patient.gender,
        blood: patient.blood,
      },
      doctor: {
        doctorId: doctor.doctorId,
        doctorName: doctor.doctorName,
        specifications: doctor.specifications,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port} 🔥`);
      console.log("Database Connected Successfully ❤️");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
