import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Pages
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import TrustVaults from '@/pages/TrustVaults';
import SmartContracts from '@/pages/SmartContracts';
import Portfolio from '@/pages/Portfolio';
import Stipulations from '@/pages/Stipulations';
import Family from '@/pages/Family';
import Payments from '@/pages/Payments';
import AppShell from '@/components/layout/AppShell';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#050810]">
        <div className="w-8 h-8 border-4 border-amber-900 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vaults" element={<TrustVaults />} />
        <Route path="/contracts" element={<SmartContracts />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/stipulations" element={<Stipulations />} />
        <Route path="/family" element={<Family />} />
        <Route path="/payments" element={<Payments />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App