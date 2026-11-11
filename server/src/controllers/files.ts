
import { Response, NextFunction } from 'express';
import { File } from '../models/File';
import { User } from '../models/User';
import { updateFileSchema } from '../validators';
import { uploadFileToDropbox, getFileDownloadUrl } from '../services/dropbox';
import { logActivityToFirebase } from '../services/firebaseService';
import { Activity } from '../models/Activity';

const getOrCreateUser = async (req: any) => {
  const auth0Id = req.auth?.payload?.sub;

  if (!auth0Id) {
    throw new Error('Auth0 user ID missing from access token');
  }

  let user = await User.findOne({ auth0Id });

  if (!user) {
    user = await User.create({
      auth0Id,
      email: req.auth?.payload?.email || `user-${Date.now()}@example.com`,
      name: req.auth?.payload?.name || 'CloudVault User',
    });
  }

  return user;
};

export const getFiles = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await getOrCreateUser(req);
    const files = await File.find({ userId: user._id }).sort({ createdAt: -1 });
    return res.json(files);
  } catch (err) {
    next(err);
  }
};

export const uploadFile = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const user = await getOrCreateUser(req);

    let dbxPath: string;

    try {
      dbxPath = await uploadFileToDropbox(
        req.file.buffer,
        req.file.originalname
      );
    } catch (err: any) {
      console.error('Dropbox upload failed:', err?.message || err);
      return res.status(502).json({
        error: err?.message || 'Dropbox upload failed. Check Dropbox configuration.',
      });
    }

    const file = await File.create({
      userId: user._id,
      filename: req.file.originalname,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      dropboxPath: dbxPath,
      isUploadedToCloud: true,
    });

    const activityData = {
      userId: user._id,
      action: 'upload',
      details: { fileId: file._id },
    };

    await Activity.create(activityData);

    try {
      await logActivityToFirebase(activityData);
    } catch (err) {
      console.warn('Firebase activity logging skipped:', err);
    }

    return res.status(201).json(file);
  } catch (err: any) {
    console.error('File upload error:', err);
    if (err?.message === 'Auth0 user ID missing from access token') {
      return res.status(401).json({ error: err.message });
    }
    return next(err);
  }
};

export const updateFile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateFileSchema.parse(req.body);
    const file = await File.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    return res.json(file);
  } catch (err) {
    next(err);
  }
};

export const deleteFile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    return res.json({ message: 'File deleted' });
  } catch (err) {
    next(err);
  }
};

export const downloadFile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.dropboxPath) {
      const url = await getFileDownloadUrl(file.dropboxPath);

      if (url) {
        return res.json({ downloadUrl: url });
      }
    }

    return res.status(404).json({ error: 'Download not available' });
  } catch (err) {
    next(err);
  }
};
