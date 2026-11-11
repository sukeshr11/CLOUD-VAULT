import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String },
  name: { type: String },
  preferences: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
