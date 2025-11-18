import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { DEMO_USERS } from '../data/mockData';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, quickLogin } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleQuickLogin = (role) => {
    const result = quickLogin(role);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">Kosek III</h1>
            <p className="text-xl mb-6">Dashboard Monitoring Koperasi</p>
            <div className="space-y-3 text-sm">
              <p>✓ Monitoring kesehatan keuangan</p>
              <p>✓ Analisis risiko koperasi</p>
              <p>✓ Audit dan kepatuhan</p>
              <p>✓ Laporan dan analitik</p>
            </div>
            <div className="mt-8 p-4 bg-blue-500 bg-opacity-50 rounded-lg">
              <p className="text-xs font-semibold mb-2">⚠️ DEMO MODE</p>
              <p className="text-xs">
                Aplikasi ini dalam mode demo. Semua data adalah contoh dan tidak
                disimpan secara permanen.
              </p>
            </div>
          </div>

          <div className="md:w-1/2 p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@demo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="demo123"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>
            </form>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Quick Demo Login:
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleQuickLogin('admin')}
                >
                  🔐 Admin Kosek III
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleQuickLogin('kosek_staff')}
                >
                  📝 Staf Kosek III
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleQuickLogin('assistant')}
                >
                  👔 Asisten Kepala Satrad
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleQuickLogin('satrad_head')}
                >
                  👨‍💼 Kepala Satrad
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleQuickLogin('manager')}
                >
                  👤 Pengelola Koperasi
                </Button>
              </div>
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-2">
                Demo Accounts:
              </p>
              {DEMO_USERS.slice(0, 3).map((user) => (
                <p key={user.id} className="text-xs text-gray-500">
                  {user.email} / {user.password}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
