import { Router } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { checkJwt } from '../middleware/auth';
import { getProfile, updateProfile } from '../controllers/auth';
import {
  getFiles,
  uploadFile,
  updateFile,
  deleteFile,
  downloadFile,
} from '../controllers/files';
import { getActivities, createActivity } from '../controllers/activity';
import { getPosts, getPostById } from '../controllers/external';
import { User } from '../models/User';
import contactsRouter from './contacts';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    storage: process.env.DROPBOX_ACCESS_TOKEN ? 'configured' : 'not_configured',
    firebase:
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY &&
      !process.env.FIREBASE_PRIVATE_KEY.includes('YOUR_ACTUAL_PRIVATE_KEY_CONTENT') &&
      process.env.FIREBASE_CLIENT_EMAIL !== 'YOUR_FIREBASE_SERVICE_ACCOUNT_EMAIL'
        ? 'configured'
        : 'not_configured',
  });
});

router.use('/contacts', contactsRouter);

router.get('/profile', checkJwt, getProfile);
router.patch('/profile', checkJwt, updateProfile);

router.get('/files', checkJwt, getFiles);
router.post('/files', checkJwt, upload.single('file'), uploadFile);
router.patch('/files/:id', checkJwt, updateFile);
router.delete('/files/:id', checkJwt, deleteFile);
router.get('/files/:id/download', checkJwt, downloadFile);

router.get('/activity', checkJwt, getActivities);
router.post('/activity', checkJwt, createActivity);

router.get('/external/posts', getPosts);
router.get('/external/posts/:id', getPostById);

export default router;