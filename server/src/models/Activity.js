"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const activitySchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    details: { type: mongoose_1.default.Schema.Types.Mixed },
}, { timestamps: true });
exports.Activity = mongoose_1.default.model('Activity', activitySchema);
//# sourceMappingURL=Activity.js.map