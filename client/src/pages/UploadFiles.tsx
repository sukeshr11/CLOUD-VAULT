
import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import {
  UploadCloud,
  File as FileIcon,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

export default function UploadFiles() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getAccessTokenSilently } = useAuth0();

  const validateAndSetFile = (selectedFile: File) => {
    setStatus('idle');
    setErrorMessage('');

    if (selectedFile.size > 50 * 1024 * 1024) {
      setFile(null);
      setStatus('error');
      setErrorMessage('File size exceeds 50MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setStatus('idle');
    setUploadProgress(0);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    try {
      const audience = import.meta.env.VITE_AUTH0_AUDIENCE?.trim();

      if (!audience) {
        throw new Error('VITE_AUTH0_AUDIENCE is missing in client/.env');
      }

      const token = await getAccessTokenSilently({
        authorizationParams: { audience },
      });

      const formData = new FormData();
      formData.append('file', file);

      await axios.post('http://localhost:5000/api/files', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (event) => {
          if (event.total) {
            setUploadProgress(
              Math.round((event.loaded * 100) / event.total)
            );
          }
        },
      });

      setStatus('success');
    } catch (err: any) {
      setStatus('error');

      const code = err?.response?.status;
      const message = err?.response?.data?.error;

      if (code === 401) {
        setErrorMessage(
          '401 Authentication failed. Check the access token and Auth0 API settings.'
        );
      } else if (code === 403) {
        setErrorMessage(
          '403 Access denied. Check Auth0 API permissions.'
        );
      } else {
        setErrorMessage(
          message || err?.message || 'File upload failed.'
        );
      }

      console.error('Upload failed:', {
        status: code,
        message: message || err?.message,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-blue-600">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Upload Files</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-blue-500">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Click or drag file to this area to upload
            </h3>
            <p className="text-sm text-slate-500">Maximum file size 50MB</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <FileIcon className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-slate-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {status !== 'uploading' && status !== 'success' && (
                <button
                  onClick={clearFile}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {status === 'uploading' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  File uploaded successfully!
                </span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <div className="flex gap-4">
              {status === 'success' ? (
                <button
                  onClick={clearFile}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Upload Another
                </button>
              ) : (
                <>
                  <button
                    onClick={clearFile}
                    disabled={status === 'uploading'}
                    className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={status === 'uploading'}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex-1 flex justify-center items-center gap-2"
                  >
                    {status === 'uploading'
                      ? 'Uploading...'
                      : 'Confirm Upload'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
