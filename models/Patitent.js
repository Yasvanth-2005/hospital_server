import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: true,
    error: 'Doctor reference is required in the prescription.',
  },
  patientId: {
    type: String,
    unique: true,
  },
  problem: {
    type: String,
    required: true,
    error: 'Problem in the prescription is required.',
  },
  description: {
    type: String,
    required: true,
    error: 'Description in the prescription is required.',
  },
  medicine: {
    type: String,
    required: true,
    error: 'Medicine in the prescription is required.',
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
    },
    patientName: {
      type: String,
      required: true,
      error: 'Patient name is required.',
    },
    age: {
      type: Number,
      required: true,
      error: 'Age is required.',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
      error: 'Gender is required.',
    },
    blood: {
      type: String,
      required: true,
      error: 'Problem description is required.',
    },
   
    prescriptions: {
      type: [PrescriptionSchema],
      default: [],
      error: 'Prescriptions should be an array of objects.',
    },
  },
  {
    timestamps: true,
  }
);

// Set patientId before saving the document
PatientSchema.pre('save', async function (next) {
  if (!this.patientId) {
    // Find the latest patient and increment the ID
    const latestPatient = await this.constructor.findOne({}, {}, { sort: { patientId: -1 } });
    const latestId = latestPatient ? parseInt(latestPatient.patientId.slice(1), 10) : 0;
    this.patientId = `P${latestId + 1}`;
  }
  next();
});

export const Patient = mongoose.model('Patient', PatientSchema);
export const Prescription = mongoose.model('Prescription', PrescriptionSchema);
