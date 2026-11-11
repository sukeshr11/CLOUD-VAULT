import { Dropbox } from 'dropbox';

let dbx: Dropbox | null = null;

if (process.env.DROPBOX_ACCESS_TOKEN) {
  dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
}

export const uploadFileToDropbox = async (fileBuffer: Buffer, filename: string): Promise<string> => {
  if (!dbx) {
    throw new Error('Dropbox is not configured. DROPBOX_ACCESS_TOKEN is missing.');
  }
  
  try {
    const response = await dbx.filesUpload({
      path: `/${filename}`,
      contents: fileBuffer
    });
    const path = response.result.path_lower;
    if (!path) throw new Error('Dropbox upload succeeded but returned no file path.');
    return path;
  } catch (error) {
    console.error('Dropbox upload error:', error);
    throw error;
  }
};

export const getFileDownloadUrl = async (path: string): Promise<string | null> => {
  if (!dbx) return null;
  
  try {
    const response = await dbx.filesGetTemporaryLink({ path });
    return response.result.link;
  } catch (error) {
    console.error('Dropbox get link error:', error);
    throw error;
  }
};
