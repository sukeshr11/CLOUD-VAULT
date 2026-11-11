"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    dropboxPath: { type: String },
    isUploadedToCloud: { type: Boolean, default: false },
    tags: [{ type: String }],
}, { timestamps: true });
exports.File = mongoose_1.default.model('File', fileSchema);
//# sourceMappingURL=File.js.map