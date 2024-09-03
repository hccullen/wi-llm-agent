import express from 'express';
import multer from 'multer';
import handleExtractQualifiers from '../controllers/extractQualifierController';

const router = express.Router();

// Set up multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/extractQualifiers', upload.single('file'), handleExtractQualifiers);

export default router;
