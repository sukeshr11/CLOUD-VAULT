"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = exports.deleteFile = exports.updateFile = exports.uploadFile = exports.getFiles = void 0;
const File_1 = require("../models/File");
const User_1 = require("../models/User");
const validators_1 = require("../validators");
const dropbox_1 = require("../services/dropbox");
const firebaseService_1 = require("../services/firebaseService");
const Activity_1 = require("../models/Activity");
const getOrCreateUser = async (req) => {
    const auth0Id = req.auth?.payload?.sub;
    if (!auth0Id) {
        throw new Error('Auth0 user ID missing from access token');
    }
    let user = await User_1.User.findOne({ auth0Id });
    if (!user) {
        user = await User_1.User.create({
            auth0Id,
            email: req.auth?.payload?.email || `user-${Date.now()}@example.com`,
            name: req.auth?.payload?.name || 'CloudVault User',
        });
    }
    return user;
};
const getFiles = async (req, res, next) => {
    try {
        const user = await getOrCreateUser(req);
        const files = await File_1.File.find({ userId: user._id }).sort({ createdAt: -1 });
        return res.json(files);
    }
    catch (err) {
        next(err);
    }
};
exports.getFiles = getFiles;
const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }
        const user = await getOrCreateUser(req);
        let dbxPath;
        try {
            dbxPath = await (0, dropbox_1.uploadFileToDropbox)(req.file.buffer, req.file.originalname);
        }
        catch (err) {
            console.error('Dropbox upload failed:', err?.message || err);
            return res.status(502).json({
                error: err?.message || 'Dropbox upload failed. Check Dropbox configuration.',
            });
        }
        const file = await File_1.File.create({
            userId: user._id,
            filename: req.file.originalname,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            dropboxPath: dbxPath,
            isUploadedToCloud: true,
        });
        const activityData = {
            userId: user._id,
            action: 'upload',
            details: { fileId: file._id },
        };
        await Activity_1.Activity.create(activityData);
        try {
            await (0, firebaseService_1.logActivityToFirebase)(activityData);
        }
        catch (err) {
            console.warn('Firebase activity logging skipped:', err);
        }
        return res.status(201).json(file);
    }
    catch (err) {
        console.error('File upload error:', err);
        if (err?.message === 'Auth0 user ID missing from access token') {
            return res.status(401).json({ error: err.message });
        }
        return next(err);
    }
};
exports.uploadFile = uploadFile;
const updateFile = async (req, res, next) => {
    try {
        const validatedData = validators_1.updateFileSchema.parse(req.body);
        const file = await File_1.File.findByIdAndUpdate(req.params.id, validatedData, { new: true });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        return res.json(file);
    }
    catch (err) {
        next(err);
    }
};
exports.updateFile = updateFile;
const deleteFile = async (req, res, next) => {
    try {
        const file = await File_1.File.findByIdAndDelete(req.params.id);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        return res.json({ message: 'File deleted' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteFile = deleteFile;
const downloadFile = async (req, res, next) => {
    try {
        const file = await File_1.File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        if (file.dropboxPath) {
            const url = await (0, dropbox_1.getFileDownloadUrl)(file.dropboxPath);
            if (url) {
                return res.json({ downloadUrl: url });
            }
        }
        return res.status(404).json({ error: 'Download not available' });
    }
    catch (err) {
        next(err);
    }
};
exports.downloadFile = downloadFile;
//# sourceMappingURL=files.js.map