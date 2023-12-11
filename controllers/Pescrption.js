import { Patient, Prescription } from './models'; // Adjust the path accordingly

export const newPescreption = async (req, res) => {
  const { patientId } = req.params;
  const { doctorId, problem, description, medicine } = req.body;

  try {
    // Check if the patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    // Create a new prescription
    const newPrescription = new Prescription({
      doctor: doctorId,
      problem,
      description,
      medicine,
    });

    // Add the prescription to the patient's prescriptions array
    patient.prescriptions.push(newPrescription);

    // Save the updated patient document
    await patient.save();

    // Return the newly created prescription
    res.status(201).json(newPrescription);
  } catch (error) {
    console.error('Error adding prescription:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
