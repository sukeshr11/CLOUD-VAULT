import { useState, useEffect } from 'react';
import { Activity as ActivityIcon, Clock, AlertCircle } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

interface Activity {
  _id: string;
  action: string;
  createdAt: string;
  details?: any;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get('http://localhost:5000/api/activity', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivities(res.data);
      } catch (err: any) {
        if (err.response?.status === 503) {
          setError('Database connection is required to fetch activity logs.');
        } else {
          setError('Failed to fetch recent activity.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [getAccessTokenSilently]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-blue-600">
          <ActivityIcon className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Recent Activity</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading activity...</div>
        ) : error ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-lg font-medium text-slate-700">{error}</p>
            <p className="text-sm mt-1">Configure MONGODB_URI in the backend to view logs.</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Clock className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-700">No recent activity</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.map(act => (
              <div key={act._id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <ActivityIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 capitalize">{act.action}</p>
                  <p className="text-sm text-slate-500">{new Date(act.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
