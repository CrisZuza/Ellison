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
      
      data[index] = { ...data[index], ...req.body };
      await writeData(mod, data);

      // Bidirectional linking logic
      if (mod === 'masters') {
        const masterId = req.params.id;
        const newServices = req.body.services || [];
        const newCourses = req.body.courses || [];

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

  // Contact Form
  app.post('/api/contact', async (req, res) => {
    const { name, phone, message, service } = req.body;
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form: ${name}`,
        text: `Name: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`,
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // Static uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Vite Integration
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    try {
      const template = await fs.readFile(path.resolve(process.cwd(), 'index.html'), 'utf-8');
      const html = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      res.status(500).end((e as Error).message);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
