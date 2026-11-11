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
        console.warn('Dropbox not configured. Skipping upload in Dev Mode.');
        return null;
    }
    try {
        const response = await dbx.filesUpload({
            path: `/${filename}`,
            contents: fileBuffer
        });
        return response.result.path_lower || null;
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