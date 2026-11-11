
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  FileText,
  HardDrive,
  Clock,
  Activity as ActivityIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const API = 'http://localhost:5000/api';

type CloudFile = {
  _id: string;
  originalName?: string;
  filename?: string;
  size?: number;
  createdAt?: string;
  uploadedAt?: string;
};

type Activity = {
  _id: string;
  action?: string;
  createdAt?: string;
  timestamp?: string;
};

type Services = {
  backend: boolean;
  database: boolean;
  storage: boolean;
  firebase: boolean;
};

const Dashboard = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [files, setFiles] = useState<CloudFile[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [services, setServices] = useState<Services>({
    backend: false,
    database: false,
    storage: false,
    firebase: false,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(`${API}/health`)
      .then((res) => {
        if (!res.ok) throw new Error('Health check failed');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        setServices({
          backend: data.status === 'ok',
          database: data.database === 'connected',
          storage: data.storage === 'configured',
          firebase: data.firebase === 'configured',
        });
      })
      .catch(() => {
        if (!cancelled) {
          setServices({
            backend: false,
            database: false,
            storage: false,
            firebase: false,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        setLoadError('Please sign in to view your files.');
        return;
      }

      try {
        setLoading(true);
        setLoadError('');

        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };

        const [filesResponse, activityResponse] = await Promise.all([
          fetch(`${API}/files`, { headers }),
          fetch(`${API}/activity`, { headers }),
        ]);

        if (!filesResponse.ok) {
          throw new Error(`Files request failed (${filesResponse.status})`);
        }

        const filesData = await filesResponse.json();
        const activityData = activityResponse.ok
          ? await activityResponse.json()
          : [];

        if (cancelled) return;

        setFiles(Array.isArray(filesData) ? filesData : []);
        setActivities(Array.isArray(activityData) ? activityData : []);
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Could not load dashboard data.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getAccessTokenSilently]);

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes < 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );

    return `${Number((bytes / Math.pow(1024, index)).toFixed(2))} ${units[index]}`;
  };

  const totalStorage = files.reduce(
    (total, file) => total + (Number(file.size) || 0),
    0
  );

  const recentUploads = activities.filter(
    (activity) => activity.action?.toLowerCase() === 'upload'
  ).length;

  const recentFiles = [...files]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.uploadedAt || 0).getTime() -
        new Date(a.createdAt || a.uploadedAt || 0).getTime()
    )
    .slice(0, 5);

  const recentActivities = [...activities]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.timestamp || 0).getTime() -
        new Date(a.createdAt || a.timestamp || 0).getTime()
    )
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome back, {isAuthenticated ? user?.name || user?.email : 'Guest'}
        </h1>
        <p className="text-slate-500 mt-2">
          Here is what's happening with your files today.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Files</p>
            <p className="text-2xl font-bold text-slate-800">
              {loading ? '...' : files.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-violet-50 text-violet-600 rounded-xl">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Storage Used</p>
            <p className="text-2xl font-bold text-slate-800">
              {loading ? '...' : formatBytes(totalStorage)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Recent Uploads</p>
            <p className="text-2xl font-bold text-slate-800">
              {loading ? '...' : recentUploads}
            </p>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Recent Files</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <p className="p-6 text-center text-slate-500">Loading files...</p>
              ) : recentFiles.length === 0 ? (
                <p className="p-6 text-center text-slate-500">
                  No files uploaded yet.
                </p>
              ) : (
                recentFiles.map((file) => (
                  <div key={file._id} className="p-5 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 truncate">
                        {file.originalName || file.filename || 'Unnamed file'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatBytes(Number(file.size) || 0)}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {file.createdAt || file.uploadedAt
                        ? new Date(
                            file.createdAt || file.uploadedAt || ''
                          ).toLocaleDateString()
                        : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                Recent Activity
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <p className="p-6 text-center text-slate-500">
                  Loading activity...
                </p>
              ) : recentActivities.length === 0 ? (
                <p className="p-6 text-center text-slate-500">
                  No recent activity found.
                </p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity._id} className="p-5 flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <ActivityIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 capitalize">
                        {activity.action || 'Activity'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {activity.createdAt || activity.timestamp
                          ? new Date(
                              activity.createdAt || activity.timestamp || ''
                            ).toLocaleString()
                          : 'Date unavailable'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <ActivityIcon className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-800">System Status</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(services).map(([key, isOnline]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 capitalize">
                    {key}
                  </span>
                  {isOnline ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      <XCircle className="w-3.5 h-3.5" />
                      Not Configured
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
