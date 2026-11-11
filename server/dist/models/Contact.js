"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const contactSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
}, { timestamps: true });
exports.Contact = mongoose_1.default.model('Contact', contactSchema);
//# sourceMappingURL=Contact.js.map