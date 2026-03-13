import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import sharp from 'sharp';

dotenv.config();

const DATA_DIR = path.join(process.cwd(), 'src/data');
const UPLOADS_DIR = process.env.UPLOAD_DIR || "/app/uploads";

// Ensure directories exist
async function ensureDirs() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.mkdir(DATA_DIR, { recursive: true });
}

ensureDirs();

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => { ... });

  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.admin = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Helper to read/write JSON
  const readData = async (file: string) => {
    try {
      const content = await fs.readFile(path.join(DATA_DIR, `${file}.json`), 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      return [];
    }
  };

  const writeData = async (file: string, data: any) => {
    await fs.writeFile(path.join(DATA_DIR, `${file}.json`), JSON.stringify(data, null, 2));
  };

  // Email Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Admin Auth
  app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ellison.md';
    const adminPass = process.env.ADMIN_PASSWORD || 'luxury_ellison_2025';

    if (email === adminEmail && password === adminPass) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });
      return res.json({ success: true });
    }
    res.status(401).json({ error: 'Invalid credentials' });
  });

  app.post('/api/admin/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true });
  });

  app.get('/api/admin/me', authenticate, (req: any, res) => {
    res.json({ email: req.admin.email });
  });

  // CMS API Routes
  const modules = ['masters', 'services', 'courses', 'products', 'gallery', 'settings', 'translations'];

  modules.forEach(mod => {
    app.get(`/api/admin/${mod}`, authenticate, async (req, res) => {
      const data = await readData(mod);
      res.json(data);
    });

    app.post(`/api/admin/${mod}`, authenticate, async (req, res) => {
      const data = await readData(mod);
      const newItem = { id: Date.now().toString(), ...req.body };
      data.push(newItem);
      await writeData(mod, data);
      res.json(newItem);
    });

    app.put(`/api/admin/${mod}/:id`, authenticate, async (req, res) => {
      let data = await readData(mod);
      const index = data.findIndex((item: any) => item.id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Not found' });
      
      const oldItem = data[index];
      data[index] = { ...data[index], ...req.body };
      await writeData(mod, data);

      // Bidirectional linking logic
      if (mod === 'masters') {
        const masterId = req.params.id;
        const newServices = req.body.services || [];
        const newCourses = req.body.courses || [];

        // Update Services
        let services = await readData('services');
        services = services.map((s: any) => {
          const masters = s.masters || [];
          if (newServices.includes(s.id)) {
            if (!masters.includes(masterId)) masters.push(masterId);
          } else {
            const idx = masters.indexOf(masterId);
            if (idx !== -1) masters.splice(idx, 1);
          }
          return { ...s, masters };
        });
        await writeData('services', services);

        // Update Courses
        let courses = await readData('courses');
        courses = courses.map((c: any) => {
          const masters = c.masters || [];
          if (newCourses.includes(c.id)) {
            if (!masters.includes(masterId)) masters.push(masterId);
          } else {
            const idx = masters.indexOf(masterId);
            if (idx !== -1) masters.splice(idx, 1);
          }
          return { ...c, masters };
        });
        await writeData('courses', courses);
      }

      if (mod === 'services') {
        const serviceId = req.params.id;
        const newMasters = req.body.masters || [];
        let masters = await readData('masters');
        masters = masters.map((m: any) => {
          const services = m.services || [];
          if (newMasters.includes(m.id)) {
            if (!services.includes(serviceId)) services.push(serviceId);
          } else {
            const idx = services.indexOf(serviceId);
            if (idx !== -1) services.splice(idx, 1);
          }
          return { ...m, services };
        });
        await writeData('masters', masters);
      }

      if (mod === 'courses') {
        const courseId = req.params.id;
        const newMasters = req.body.masters || [];
        let masters = await readData('masters');
        masters = masters.map((m: any) => {
          const c = m.courses || [];
          if (newMasters.includes(m.id)) {
            if (!c.includes(courseId)) c.push(courseId);
          } else {
            const idx = c.indexOf(courseId);
            if (idx !== -1) c.splice(idx, 1);
          }
          return { ...m, courses: c };
        });
        await writeData('masters', masters);
      }

      res.json(data[index]);
    });

    app.delete(`/api/admin/${mod}/:id`, authenticate, async (req, res) => {
      let data = await readData(mod);
      data = data.filter((item: any) => item.id !== req.params.id);
      await writeData(mod, data);
      res.json({ success: true });
    });
  });

  // Image Upload & Optimization
  app.post('/api/admin/upload', authenticate, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filename = `${Date.now()}-${req.file.originalname.split('.')[0]}`;
    const sizes = [300, 800, 1600];
    const paths: any = {};

    try {
      for (const size of sizes) {
        const sizeFilename = `${filename}-${size}.webp`;
        const outputPath = path.join(UPLOADS_DIR, sizeFilename);
        
        await sharp(req.file.buffer)
          .resize(size, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        paths[size] = `/uploads/${sizeFilename}`;
      }

      // Original size as well
      const originalFilename = `${filename}-original.webp`;
      await sharp(req.file.buffer)
        .webp({ quality: 90 })
        .toFile(path.join(UPLOADS_DIR, originalFilename));
      
      paths.original = `/uploads/${originalFilename}`;

      res.json(paths);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Image processing failed' });
    }
  });

  // Public API Routes
  app.get('/api/masters', async (req, res) => res.json(await readData('masters')));
  app.get('/api/services', async (req, res) => res.json(await readData('services')));
  app.get('/api/courses', async (req, res) => res.json(await readData('courses')));
  app.get('/api/products', async (req, res) => res.json(await readData('products')));
  app.get('/api/gallery', async (req, res) => res.json(await readData('gallery')));
  app.get('/api/settings', async (req, res) => res.json(await readData('settings')));
  app.get('/api/translations', async (req, res) => res.json(await readData('translations')));

  app.post('/api/book', async (req, res) => {
    const { name, phone, service, master, date, time, language } = req.body;

    if (!name || !phone || !service || !master || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const timestamp = new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Chisinau' });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'DM Sans', sans-serif; background-color: #000; color: #fff; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a; padding: 40px; border-radius: 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .header h1 { font-family: 'Bodoni Moda', serif; color: #fff; letter-spacing: 0.25em; text-transform: uppercase; font-size: 28px; margin: 0; }
          .header .gold { color: #C5A059; }
          .content { margin-bottom: 40px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 12px 0; border-bottom: 1px solid #1a1a1a; }
          .label { color: #666; text-transform: uppercase; font-size: 9px; letter-spacing: 0.2em; width: 150px; font-weight: bold; }
          .value { color: #fff; font-size: 14px; }
          .footer { text-align: center; color: #333; font-size: 9px; text-transform: uppercase; letter-spacing: 0.4em; margin-top: 40px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ÉLLISON</h1>
            <p style="color: #C5A059; font-size: 9px; letter-spacing: 0.5em; margin-top: 12px; font-weight: bold; text-transform: uppercase;">BEAUTY ROOM</p>
          </div>
          <div class="content">
            <h2 style="font-family: 'Bodoni Moda', serif; font-size: 18px; margin-bottom: 20px; border-bottom: 1px solid #C5A059; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 0.2em;">New Booking Details</h2>
            <table>
              <tr><td class="label">Client Name</td><td class="value">${name}</td></tr>
              <tr><td class="label">Phone Number</td><td class="value">${phone}</td></tr>
              <tr><td class="label">Service</td><td class="value">${service}</td></tr>
              <tr><td class="label">Master</td><td class="value">${master}</td></tr>
              <tr><td class="label">Date</td><td class="value">${date}</td></tr>
              <tr><td class="label">Time</td><td class="value">${time}</td></tr>
              <tr><td class="label">Language</td><td class="value">${language}</td></tr>
              <tr><td class="label">Timestamp</td><td class="value">${timestamp}</td></tr>
            </table>
          </div>
          <div class="footer">
            ÉLLISON BEAUTY ROOM — EXCELLENCE IN BEAUTY
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: `"ÉLLISON System" <${process.env.SMTP_USER}>`,
        to: process.env.TARGET_EMAIL,
        cc: process.env.CC_EMAIL,
        subject: `New Booking — ÉLLISON BEAUTY ROOM — ${name}`,
        html: emailHtml,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Email Error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  app.post('/api/enroll', async (req, res) => {
    const { name, phone, instagram, course, language, startDate } = req.body;

    if (!name || !phone || !course || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const timestamp = new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Chisinau' });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'DM Sans', sans-serif; background-color: #000; color: #fff; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a; padding: 40px; border-radius: 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .header h1 { font-family: 'Bodoni Moda', serif; color: #fff; letter-spacing: 0.25em; text-transform: uppercase; font-size: 28px; margin: 0; }
          .header .gold { color: #C5A059; }
          .content { margin-bottom: 40px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 12px 0; border-bottom: 1px solid #1a1a1a; }
          .label { color: #666; text-transform: uppercase; font-size: 9px; letter-spacing: 0.2em; width: 150px; font-weight: bold; }
          .value { color: #fff; font-size: 14px; }
          .footer { text-align: center; color: #333; font-size: 9px; text-transform: uppercase; letter-spacing: 0.4em; margin-top: 40px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ÉLLISON</h1>
            <p style="color: #C5A059; font-size: 9px; letter-spacing: 0.5em; margin-top: 12px; font-weight: bold; text-transform: uppercase;">BEAUTY ROOM</p>
          </div>
          <div class="content">
            <h2 style="font-family: 'Bodoni Moda', serif; font-size: 18px; margin-bottom: 20px; border-bottom: 1px solid #C5A059; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 0.2em;">New Course Enrollment</h2>
            <table>
              <tr><td class="label">Student Name</td><td class="value">${name}</td></tr>
              <tr><td class="label">Phone Number</td><td class="value">${phone}</td></tr>
              <tr><td class="label">Instagram</td><td class="value">${instagram || 'N/A'}</td></tr>
              <tr><td class="label">Course</td><td class="value">${course}</td></tr>
              <tr><td class="label">Start Date</td><td class="value">${startDate}</td></tr>
              <tr><td class="label">Language</td><td class="value">${language}</td></tr>
              <tr><td class="label">Timestamp</td><td class="value">${timestamp}</td></tr>
            </table>
          </div>
          <div class="footer">
            ÉLLISON BEAUTY ROOM — EXCELLENCE IN BEAUTY
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: `"ÉLLISON System" <${process.env.SMTP_USER}>`,
        to: process.env.TARGET_EMAIL,
        cc: process.env.CC_EMAIL,
        subject: `New Enrollment — ÉLLISON BEAUTY ROOM — ${name}`,
        html: emailHtml,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Email Error:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
