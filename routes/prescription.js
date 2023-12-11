import express from 'express';
import { newPescreption } from '../controllers/Pescrption'; // Adjust the path accordingly

const router = express.Router();

router.post('/:patientId/prescriptions', newPescreption);

export default router;
