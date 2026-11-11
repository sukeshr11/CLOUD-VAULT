"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = require("../middleware/auth");
const auth_2 = require("../controllers/auth");
const files_1 = require("../controllers/files");
const activity_1 = require("../controllers/activity");
const external_1 = require("../controllers/external");
const contacts_1 = __importDefault(require("./contacts"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});
router.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        database: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected',
        storage: process.env.DROPBOX_ACCESS_TOKEN ? 'configured' : 'not_configured',
        firebase: process.env.FIREBASE_PROJECT_ID &&
            process.env.FIREBASE_CLIENT_EMAIL &&
            process.env.FIREBASE_PRIVATE_KEY &&
            !process.env.FIREBASE_PRIVATE_KEY.includes('YOUR_ACTUAL_PRIVATE_KEY_CONTENT') &&
            process.env.FIREBASE_CLIENT_EMAIL !== 'YOUR_FIREBASE_SERVICE_ACCOUNT_EMAIL'
            ? 'configured'
            : 'not_configured',
    });
});
router.use('/contacts', contacts_1.default);
router.get('/profile', auth_1.checkJwt, auth_2.getProfile);
router.patch('/profile', auth_1.checkJwt, auth_2.updateProfile);
router.get('/files', auth_1.checkJwt, files_1.getFiles);
router.post('/files', auth_1.checkJwt, upload.single('file'), files_1.uploadFile);
router.patch('/files/:id', auth_1.checkJwt, files_1.updateFile);
router.delete('/files/:id', auth_1.checkJwt, files_1.deleteFile);
router.get('/files/:id/download', auth_1.checkJwt, files_1.downloadFile);
router.get('/activity', auth_1.checkJwt, activity_1.getActivities);
router.post('/activity', auth_1.checkJwt, activity_1.createActivity);
router.get('/external/posts', external_1.getPosts);
router.get('/external/posts/:id', external_1.getPostById);
exports.default = router;
//# sourceMappingURL=index.js.map