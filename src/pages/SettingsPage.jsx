import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { DEMO_USERS } from '../data/mockData';

const SettingsPage = () => {
  const { currentUser, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSwitchRole = (userId) => {
    const result = switchRole(userId);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <Layout title="Pengaturan Demo">
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Mode Demo</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Aplikasi ini berjalan dalam mode demo. Semua data adalah contoh dan
                  disimpan hanya di memori browser. Perubahan akan hilang saat halaman
                  di-refresh.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <h3 className="text-lg font-semibold mb-4">User Saat Ini</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nama:</span>
              <span className="font-medium">{currentUser?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="font-medium">{currentUser?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Role:</span>
              <Badge
                color={
                  currentUser?.role === 'admin'
                    ? 'blue'
                    : currentUser?.role === 'auditor'
                    ? 'green'
                    : currentUser?.role === 'analyst'
                    ? 'yellow'
                    : 'gray'
                }
              >
                {currentUser?.roleLabel}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Demo Users & Role Switching</h3>
          <p className="text-sm text-gray-600 mb-4">
            Klik tombol di bawah untuk berpindah role dan melihat dashboard dari
            perspektif user yang berbeda.
          </p>

          <div className="space-y-3">
            {DEMO_USERS.map((user) => (
              <div
                key={user.id}
                className={`p-4 border rounded-lg ${
                  currentUser?.id === user.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <Badge
                        color={
                          user.role === 'admin'
                            ? 'blue'
                            : user.role === 'auditor'
                            ? 'green'
                            : user.role === 'analyst'
                            ? 'yellow'
                            : 'gray'
                        }
                      >
                        {user.roleLabel}
                      </Badge>
                      {currentUser?.id === user.id && (
                        <Badge color="blue">Aktif</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                  </div>

                  {currentUser?.id !== user.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSwitchRole(user.id)}
                    >
                      Switch ke Role Ini
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Permissions per Role</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Admin Kosek III (Full Access)
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Lihat semua koperasi dan data lengkap</li>
                <li>Tambah, edit, dan hapus data koperasi</li>
                <li>Kelola user dan assign manager koperasi</li>
                <li>Tambah audit dan catatan follow-up</li>
                <li>Akses penuh ke analitik dan laporan</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Auditor / Pengawas
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Lihat semua koperasi</li>
                <li>Tambah catatan audit dan risk flags</li>
                <li>Update status follow-up</li>
                <li>Akses ke analitik dan laporan</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Analis Keuangan
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Lihat semua koperasi</li>
                <li>Akses penuh ke analitik dan charts</li>
                <li>Generate dan export laporan</li>
                <li>Lihat tren dan perbandingan</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Pengelola Koperasi
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Lihat dan edit data koperasi sendiri saja</li>
                <li>Dashboard terbatas untuk koperasi sendiri</li>
                <li>Lihat status audit dan kepatuhan</li>
                <li>Tidak bisa akses data koperasi lain</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Fitur Demo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">✓ Tersedia</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Dashboard overview</li>
                <li>• Master data koperasi</li>
                <li>• Detail & analisis koperasi</li>
                <li>• Audit tracking</li>
                <li>• Task management</li>
                <li>• Analytics & reports</li>
                <li>• CSV export</li>
                <li>• Role-based access</li>
              </ul>
            </Card>

            <Card className="bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">✗ Tidak Tersedia (Demo)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real backend/API</li>
                <li>• Database persistence</li>
                <li>• File upload sebenarnya</li>
                <li>• Email notifications</li>
                <li>• Real-time updates</li>
                <li>• localStorage/sessionStorage</li>
                <li>• Cookies</li>
              </ul>
            </Card>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Coba switch ke role yang berbeda untuk melihat
            bagaimana dashboard dan permission berubah sesuai role. Semua perubahan
            data akan reset saat halaman di-refresh.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
