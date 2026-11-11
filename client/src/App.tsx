
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Layout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import MyFiles from './pages/MyFiles';
import UploadFiles from './pages/UploadFiles';
import RecentActivity from './pages/RecentActivity';
import CloudServices from './pages/CloudServices';
import ApiExplorer from './pages/ApiExplorer';
import ProfileSettings from './pages/ProfileSettings';
import ContactsDemo from './pages/ContactsDemo';

const ProtectedRoute = ({ component: Component }: { component: React.ComponentType<any> }) => {
  const ProtectedComponent = withAuthenticationRequired(Component, {
    onRedirecting: () => (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-slate-500 font-medium">Redirecting to login...</p>
      </div>
    ),
  });
  return <ProtectedComponent />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="contacts" element={<ContactsDemo />} />
          <Route path="files" element={<ProtectedRoute component={MyFiles} />} />
          <Route path="upload" element={<ProtectedRoute component={UploadFiles} />} />
          <Route path="activity" element={<ProtectedRoute component={RecentActivity} />} />
          <Route path="services" element={<CloudServices />} />
          <Route path="api-explorer" element={<ApiExplorer />} />
          <Route path="profile" element={<ProtectedRoute component={ProfileSettings} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
