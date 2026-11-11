"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String },
    name: { type: String },
    preferences: { type: mongoose_1.default.Schema.Types.Mixed, default: {} },
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map