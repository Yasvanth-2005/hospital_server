import { Doctor } from "../models/Doctor";

export const fetchDoctor = async (req, res) => {
  try {
    const { id } = req.params; // Corrected parameter name
    
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    
    return res.status(200).json(doctor);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
}
