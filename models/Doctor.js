import mongoose from "mongoose";

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

const DoctorSchema = mongoose.Schema(
  {
    doctorId: {
      type: String,

      unique: true,
    },
    doctorName: {
      type: String,
      required: true,
      unique: true,
      error: "Doctor name is required.",
    },
    phoneNumber: {
      type: String,
      required: true,
      error: "Phone number is required.",
    },
    email: {
      type: String,
      required: true,
      error: "Email is required.",
      unique: true,
      uniqueError: "This email is already registered.",
    },
    password: {
      type: String,
      required: true,
      error: "Password is required.",
    },
    specifications: {
      type: String,
      required: true,
      error: "Specifications are required.",
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

// Set doctorId before saving the document
DoctorSchema.pre("save", async function (next) {
  if (!this.doctorId) {
    // Find the latest doctor and increment the ID
    const latestDoctor = await this.constructor.findOne(
      {},
      {},
      { sort: { doctorId: -1 } }
    );
    const latestId = latestDoctor
      ? parseInt(latestDoctor.doctorId.slice(3), 10)
      : 0;
    this.doctorId = `DOC${String(latestId + 1).padStart(4, "0")}`;
  }
  next();
});

export const Doctor = mongoose.model("Doctor", DoctorSchema);
