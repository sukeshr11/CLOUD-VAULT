"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileDownloadUrl = exports.uploadFileToDropbox = void 0;
const dropbox_1 = require("dropbox");
let dbx = null;
if (process.env.DROPBOX_ACCESS_TOKEN) {
    dbx = new dropbox_1.Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
}
const uploadFileToDropbox = async (fileBuffer, filename) => {
    if (!dbx) {
        throw new Error('Dropbox is not configured. DROPBOX_ACCESS_TOKEN is missing.');
    }
    try {
        const response = await dbx.filesUpload({
            path: `/${filename}`,
            contents: fileBuffer
        });
        const path = response.result.path_lower;
        if (!path)
            throw new Error('Dropbox upload succeeded but returned no file path.');
        return path;
    }
    catch (error) {
        console.error('Dropbox upload error:', error);
        throw error;
    }
};
exports.uploadFileToDropbox = uploadFileToDropbox;
const getFileDownloadUrl = async (path) => {
    if (!dbx)
        return null;
    try {
        const response = await dbx.filesGetTemporaryLink({ path });
        return response.result.link;
    }
    catch (error) {
        console.error('Dropbox get link error:', error);
        throw error;
    }
};
exports.getFileDownloadUrl = getFileDownloadUrl;
//# sourceMappingURL=dropbox.js.map