import express from 'express';
import { authCitizen, signupCitizen } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authCitizen);
router.post('/signup', signupCitizen);

export default router;
