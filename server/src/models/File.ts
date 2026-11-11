import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  dropboxPath: { type: String },
  isUploadedToCloud: { type: Boolean, default: false },
  tags: [{ type: String }],
}, { timestamps: true });

export const File = mongoose.model('File', fileSchema);
