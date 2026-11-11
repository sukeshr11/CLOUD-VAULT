import { Router } from 'express';
import mongoose from 'mongoose';
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from '../controllers/contacts';

const router = Router();

router.use((_req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'MongoDB is not connected. Check MONGODB_URI.' });
  }
  next();
});

router.get('/', getContacts);
router.post('/', createContact);
router.patch('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
