"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.createContact = exports.getContacts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const Contact_1 = require("../models/Contact");
const contactSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Name is required.').max(80),
    email: zod_1.z.string().trim().email('Enter a valid email address.').max(254),
    phone: zod_1.z.string().trim().max(30).optional().default(''),
});
const contactUpdateSchema = contactSchema.partial().refine((contact) => Object.keys(contact).length > 0, 'Provide at least one field to update.');
const isValidId = (id) => mongoose_1.default.isValidObjectId(id);
const getContacts = async (_req, res, next) => {
    try {
        const contacts = await Contact_1.Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    }
    catch (error) {
        next(error);
    }
};
exports.getContacts = getContacts;
const createContact = async (req, res, next) => {
    try {
        const result = contactSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues[0]?.message ?? 'Invalid contact.' });
        }
        const contact = await Contact_1.Contact.create(result.data);
        res.status(201).json(contact);
    }
    catch (error) {
        next(error);
    }
};
exports.createContact = createContact;
const updateContact = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string' || !isValidId(id)) {
            return res.status(400).json({ error: 'Invalid contact ID.' });
        }
        const result = contactUpdateSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues[0]?.message ?? 'Invalid contact.' });
        }
        const contact = await Contact_1.Contact.findByIdAndUpdate(id, result.data, {
            new: true,
            runValidators: true,
        });
        if (!contact)
            return res.status(404).json({ error: 'Contact not found.' });
        res.json(contact);
    }
    catch (error) {
        next(error);
    }
};
exports.updateContact = updateContact;
const deleteContact = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string' || !isValidId(id)) {
            return res.status(400).json({ error: 'Invalid contact ID.' });
        }
        const contact = await Contact_1.Contact.findByIdAndDelete(id);
        if (!contact)
            return res.status(404).json({ error: 'Contact not found.' });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteContact = deleteContact;
//# sourceMappingURL=contacts.js.map