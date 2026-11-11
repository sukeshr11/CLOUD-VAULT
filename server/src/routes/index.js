"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const auth_2 = require("../controllers/auth");
const files_1 = require("../controllers/files");
const activity_1 = require("../controllers/activity");
const external_1 = require("../controllers/external");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Health check
router.get('/health', (req, res) => res.json({ status: 'ok' }));
// Profile (requires auth)
router.get('/profile', auth_1.checkJwt, auth_2.getProfile);
router.patch('/profile', auth_1.checkJwt, auth_2.updateProfile);
// Files (requires auth)
router.get('/files', auth_1.checkJwt, files_1.getFiles);
router.post('/files', auth_1.checkJwt, upload.single('file'), files_1.uploadFile);
router.patch('/files/:id', auth_1.checkJwt, files_1.updateFile);
router.delete('/files/:id', auth_1.checkJwt, files_1.deleteFile);
router.get('/files/:id/download', auth_1.checkJwt, files_1.downloadFile);
// Activity (requires auth)
router.get('/activity', auth_1.checkJwt, activity_1.getActivities);
router.post('/activity', auth_1.checkJwt, activity_1.createActivity);
// External
router.get('/external/posts', external_1.getPosts);
router.get('/external/posts/:id', external_1.getPostById);
exports.default = router;
//# sourceMappingURL=index.js.map