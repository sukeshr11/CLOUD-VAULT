import { useState, useEffect } from 'react';
import { Folder, Search, Download, Trash2, File as FileIcon } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

interface FileData {
  _id: string;
  originalName: string;
  filename: string;
  size: number;
  mimetype: string;
  createdAt: string;
  isUploadedToCloud: boolean;
}

export default function MyFiles() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { getAccessTokenSilently } = useAuth0();

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently();
      const res = await axios.get('http://localhost:5000/api/files', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(res.data);
    } catch (err) {
      console.error('Failed to fetch files', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [getAccessTokenSilently]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`http://localhost:5000/api/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(files.filter(f => f._id !== id));
    } catch (err) {
      alert('Failed to delete file');
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`http://localhost:5000/api/files/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.downloadUrl) {
        window.open(res.data.downloadUrl, '_blank');
      }
    } catch (err) {
      alert('Download not available or failed');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(f => f.originalName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-blue-600">
            <Folder className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">My Files</h1>
        </div>
        
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading files...</div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Folder className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-700">No files found</p>
            <p className="text-sm mt-1">Upload some files to see them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Size</th>
                  <th className="p-4 font-medium">Date Uploaded</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map(file => (
                  <tr key={file._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                          <FileIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 truncate max-w-[200px] sm:max-w-xs">{file.originalName}</p>
                          <p className="text-xs text-slate-400">{file.mimetype}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">{formatBytes(file.size)}</td>
                    <td className="p-4 text-slate-600 text-sm">{new Date(file.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-sm">
                      {file.isUploadedToCloud ? (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium border border-emerald-100">Cloud</span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">Local DB</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDownload(file._id)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(file._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
