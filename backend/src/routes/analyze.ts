import { Router, Request, Response } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
const pdfParse = require('pdf-parse');
import { analyzeResume } from '../utils/ai';

const router = Router();

// 2MB size cap
const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Rate limiting for guest endpoints
const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', analyzeLimiter, upload.single('resume'), async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Incoming request body:', req.body);
    console.log('Incoming file:', req.file ? req.file.originalname : 'No file');

    const { jd, resumeText: providedResumeText } = req.body;
    const file = req.file;

    if (!jd) {
      console.log('Error: Job description is required.');
      res.status(400).json({ error: 'Job description is required.' });
      return;
    }

    let resumeContent = '';

    if (file) {
      // Parse PDF
      if (file.mimetype !== 'application/pdf') {
        console.log('Error: Only PDF files are supported. Received:', file.mimetype);
        res.status(400).json({ error: 'Only PDF files are supported.' });
        return;
      }
      try {
        const data = await pdfParse(file.buffer);
        resumeContent = data.text;
        console.log('Successfully parsed PDF, length:', resumeContent.length);
      } catch (err) {
        console.error('Error parsing PDF:', err);
        res.status(400).json({ error: 'Failed to parse PDF.' });
        return;
      }
    } else if (providedResumeText) {
      resumeContent = providedResumeText;
    } else {
      console.log('Error: Either resume file or resumeText is required.');
      res.status(400).json({ error: 'Either resume file or resumeText is required.' });
      return;
    }

    if (!resumeContent.trim()) {
      console.log('Error: Resume content is empty.');
      res.status(400).json({ error: 'Resume content is empty.' });
      return;
    }

    // Call AI integration
    console.log('Calling AI integration...');
    const analysis = await analyzeResume(resumeContent, jd);
    console.log('AI analysis completed.');

    res.json({ analysis, parsed_text: resumeContent });
  } catch (error: any) {
    console.error('Analyze Error:', error);
    let errorMessage = 'เกิดข้อผิดพลาดในการวิเคราะห์ข้อมูล (Internal Server Error)';
    
    if (error.status === 503 || (error.message && error.message.includes('503'))) {
      errorMessage = 'เซิร์ฟเวอร์ AI ของ Google มีผู้ใช้งานหนาแน่น กรุณารอสักครู่แล้วลองใหม่อีกครั้ง';
    } else if (error.message) {
      errorMessage = `ข้อผิดพลาดจากระบบ AI: ${error.message}`;
    }

    res.status(500).json({ error: errorMessage });
  }
});

export default router;
