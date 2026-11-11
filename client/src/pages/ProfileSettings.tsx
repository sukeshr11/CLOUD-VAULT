import { useAuth0 } from '@auth0/auth0-react';
import { User, Mail, Shield } from 'lucide-react';

export default function ProfileSettings() {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-blue-600">
          <User className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Profile Settings</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-6">
          <img src={user?.picture} alt="Profile" className="w-24 h-24 rounded-full ring-4 ring-slate-50" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
            <div className="flex items-center gap-2 text-slate-500 mt-1">
              <Mail className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <Shield className="w-6 h-6 text-slate-400 shrink-0" />
            <div>
              <h3 className="font-medium text-slate-800">Authentication Provider</h3>
              <p className="text-sm text-slate-500 mt-1">
                Your identity is managed securely by Auth0. Profile updates (like password changes) must be performed through the Auth0 portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
