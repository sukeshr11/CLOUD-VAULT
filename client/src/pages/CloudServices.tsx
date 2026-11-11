
import { useEffect, useState } from 'react';
import {
  Cloud,
  Database,
  Lock,
  Server,
  ShieldCheck,
  CheckCircle,
  XCircle,
  LoaderCircle,
} from 'lucide-react';

type HealthResponse = {
  status?: string;
  database?: string;
  storage?: string;
  firebase?: string;
};

type Service = {
  name: string;
  description: string;
  status: boolean | null;
  statusText: string;
  icon: typeof Cloud;
  color: string;
};

export default function CloudServices() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('http://localhost:5000/api/health')
      .then((response) => {
        if (!response.ok) throw new Error('Health check failed');
        return response.json();
      })
      .then((data: HealthResponse) => {
        if (!cancelled) setHealth(data);
      })
      .catch(() => {
        if (!cancelled) setHealth(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const services: Service[] = [
    {
      name: 'Auth0',
      icon: Lock,
      description: 'Identity management and authentication',
      status: true,
      statusText: 'Connected',
      color: 'blue',
    },
    {
      name: 'Backend API',
      icon: Server,
      description: 'Express.js REST API server',
      status: health?.status === 'ok',
      statusText: loading
        ? 'Checking...'
        : health?.status === 'ok'
          ? 'Online'
          : 'Offline',
      color: 'slate',
    },
    {
      name: 'MongoDB Atlas',
      icon: Database,
      description: 'Database for file metadata',
      status: health ? health.database === 'connected' : false,
      statusText: loading
        ? 'Checking...'
        : !health
          ? 'Unavailable'
          : health.database === 'connected'
            ? 'Connected'
            : 'Disconnected',
      color: 'emerald',
    },
    {
      name: 'Dropbox',
      icon: Cloud,
      description: 'Cloud storage for uploaded files',
      status: health ? health.storage === 'configured' : false,
      statusText: loading
        ? 'Checking...'
        : !health
          ? 'Unavailable'
          : health.storage === 'configured'
            ? 'Configured'
            : 'Not Configured',
      color: 'blue',
    },
    {
      name: 'Firebase',
      icon: ShieldCheck,
      description: 'Firebase Admin integration',
      status: health ? health.firebase === 'configured' : false,
      statusText: loading
        ? 'Checking...'
        : !health
          ? 'Unavailable'
          : health.firebase === 'configured'
            ? 'Connected'
            : 'Not Configured',
      color: 'amber',
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    slate: 'bg-slate-50 text-slate-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-blue-600">
          <Cloud className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Cloud Services
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Live integration status from your backend
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.name}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between min-h-48"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    colorClasses[service.color] || colorClasses.blue
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6 gap-3">
                <span className="text-sm font-medium text-slate-600">
                  Integration Status
                </span>

                <span
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${
                    service.status === true
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : service.status === null
                        ? 'text-blue-700 bg-blue-50 border-blue-200'
                        : 'text-slate-500 bg-slate-100 border-slate-200'
                  }`}
                >
                  {loading ? (
                    <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                  ) : service.status === true ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {service.statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
