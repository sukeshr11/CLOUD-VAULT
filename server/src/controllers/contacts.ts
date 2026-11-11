import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Contact } from '../models/Contact';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(80),
  email: z.string().trim().email('Enter a valid email address.').max(254),
  phone: z.string().trim().max(30).optional().default(''),
});

const contactUpdateSchema = contactSchema.partial().refine(
  (contact) => Object.keys(contact).length > 0,
  'Provide at least one field to update.',
);

const isValidId = (id: string) => mongoose.isValidObjectId(id);

export const getContacts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = contactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0]?.message ?? 'Invalid contact.' });
    }

    const contact = await Contact.create(result.data);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string' || !isValidId(id)) {
      return res.status(400).json({ error: 'Invalid contact ID.' });
    }

    const result = contactUpdateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0]?.message ?? 'Invalid contact.' });
    }

    const contact = await Contact.findByIdAndUpdate(id, result.data, {
      new: true,
      runValidators: true,
    });
    if (!contact) return res.status(404).json({ error: 'Contact not found.' });

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string' || !isValidId(id)) {
      return res.status(400).json({ error: 'Invalid contact ID.' });
    }

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) return res.status(404).json({ error: 'Contact not found.' });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
