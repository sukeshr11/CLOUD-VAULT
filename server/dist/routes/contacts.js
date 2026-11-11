"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const contacts_1 = require("../controllers/contacts");
const router = (0, express_1.Router)();
router.use((_req, res, next) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        return res.status(503).json({ error: 'MongoDB is not connected. Check MONGODB_URI.' });
    }
    next();
});
router.get('/', contacts_1.getContacts);
router.post('/', contacts_1.createContact);
router.patch('/:id', contacts_1.updateContact);
router.delete('/:id', contacts_1.deleteContact);
exports.default = router;
//# sourceMappingURL=contacts.js.map