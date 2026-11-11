import { useState } from 'react';
import { Terminal, Play, Server, Code } from 'lucide-react';
import axios from 'axios';

export default function ApiExplorer() {
  const [activeTab, setActiveTab] = useState<'posts' | 'singlePost'>('posts');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postId, setPostId] = useState('1');

  const handleRequest = async (endpoint: string) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/external/${endpoint}`);
      setResponse(res.data);
    } catch (err: any) {
      setResponse({ error: err.message, data: err.response?.data });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-blue-600">
          <Terminal className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">API Explorer</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-medium text-slate-700 flex items-center gap-2">
              <Server className="w-4 h-4" /> Endpoints
            </div>
            <div className="p-2">
              <button
                onClick={() => setActiveTab('posts')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center justify-between ${
                  activeTab === 'posts' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span>Get All Posts</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">GET</span>
              </button>
              <button
                onClick={() => setActiveTab('singlePost')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center justify-between mt-1 ${
                  activeTab === 'singlePost' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span>Get Post By ID</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">GET</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-sm text-slate-600">
                <span className="text-blue-600 font-bold">GET</span>
                <span>/api/external/{activeTab === 'posts' ? 'posts' : `posts/${postId}`}</span>
              </div>
              <button
                onClick={() => handleRequest(activeTab === 'posts' ? 'posts' : `posts/${postId}`)}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" /> {isLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
            
            {activeTab === 'singlePost' && (
              <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Post ID:</label>
                <input 
                  type="number" 
                  value={postId} 
                  onChange={e => setPostId(e.target.value)}
                  className="border border-slate-200 rounded-md px-3 py-1 text-sm outline-none focus:border-blue-500 w-24"
                />
              </div>
            )}

            <div className="flex-1 bg-slate-900 overflow-auto p-4 relative">
              {!response && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <Code className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">Click Send Request to view the response</p>
                </div>
              )}
              {response && (
                <pre className="text-emerald-400 font-mono text-sm">
                  {JSON.stringify(response, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
