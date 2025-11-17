import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Layout from '../components/layout/Layout';
import { MetricCard } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { formatCurrency, formatNumber, getRiskColor, formatDate } from '../utils/helpers';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { currentUser, hasPermission } = useAuth();
  const { cooperatives } = useData();

  if (!currentUser) {
    return (
      <Layout title="Dashboard">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!cooperatives || !Array.isArray(cooperatives)) {
    return (
      <Layout title="Dashboard">
        <div className="text-center py-12">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </Layout>
    );
  }

  const isManager = currentUser?.role === 'manager';
  const managerCoop = isManager
    ? cooperatives.find((c) => c.id === currentUser.cooperativeId)
    : null;

  if (isManager) {
    return <ManagerDashboard cooperative={managerCoop} />;
  }

  const activeCoops = cooperatives.filter((c) => c.status === 'Active');
  const totalMembers = cooperatives.reduce((sum, c) => sum + c.totalMembers, 0);
  const totalAssets = cooperatives.reduce((sum, c) => sum + c.totalAssets, 0);
  const totalLoans = cooperatives.reduce((sum, c) => sum + c.totalLoanPortfolio, 0);

  const riskDistribution = {
    Low: cooperatives.filter((c) => c.riskLevel === 'Low').length,
    Medium: cooperatives.filter((c) => c.riskLevel === 'Medium').length,
    High: cooperatives.filter((c) => c.riskLevel === 'High').length,
  };

  const riskChartData = [
    { name: 'Low Risk', value: riskDistribution.Low, color: '#10b981' },
    { name: 'Medium Risk', value: riskDistribution.Medium, color: '#f59e0b' },
    { name: 'High Risk', value: riskDistribution.High, color: '#ef4444' },
  ];

  const healthScoreData = cooperatives.map((c) => ({
    name: c.code,
    score: c.healthScore,
  }));

  const topCooperatives = [...cooperatives]
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 5);

  return (
    <Layout title="Dashboard Overview">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Koperasi"
            value={cooperatives.length}
            subtitle={`${activeCoops.length} aktif, ${cooperatives.length - activeCoops.length} tidak aktif`}
            icon={<span className="text-2xl">🏢</span>}
          />
          <MetricCard
            title="Total Anggota"
            value={formatNumber(totalMembers)}
            subtitle="Seluruh koperasi"
            icon={<span className="text-2xl">👥</span>}
          />
          <MetricCard
            title="Total Aset"
            value={formatCurrency(totalAssets)}
            subtitle="Agregat seluruh koperasi"
            icon={<span className="text-2xl">💰</span>}
          />
          <MetricCard
            title="Total Pinjaman"
            value={formatCurrency(totalLoans)}
            subtitle="Outstanding loans"
            icon={<span className="text-2xl">💳</span>}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Distribusi Risiko</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Risk</span>
                <span className="font-semibold text-green-600">
                  {riskDistribution.Low} koperasi
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Medium Risk</span>
                <span className="font-semibold text-yellow-600">
                  {riskDistribution.Medium} koperasi
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Risk</span>
                <span className="font-semibold text-red-600">
                  {riskDistribution.High} koperasi
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Skor Kesehatan Koperasi</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={healthScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top 5 Koperasi</h3>
            <button
              onClick={() => navigate('/cooperatives')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat Semua →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nama Koperasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Skor Kesehatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Risiko
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Audit Terakhir
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCooperatives.map((coop) => (
                  <tr
                    key={coop.id}
                    onClick={() => navigate(`/cooperatives/${coop.id}`)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{coop.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coop.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coop.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-semibold text-lg mr-2">
                          {coop.healthScore}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              coop.healthScore >= 80
                                ? 'bg-green-500'
                                : coop.healthScore >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${coop.healthScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        color={
                          coop.riskLevel === 'Low'
                            ? 'green'
                            : coop.riskLevel === 'Medium'
                            ? 'yellow'
                            : 'red'
                        }
                      >
                        {coop.riskLevel}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(coop.lastAuditDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const ManagerDashboard = ({ cooperative }) => {
  const navigate = useNavigate();

  if (!cooperative) {
    return (
      <Layout title="Dashboard">
        <div className="text-center py-12">
          <p className="text-gray-500">Koperasi tidak ditemukan.</p>
        </div>
      </Layout>
    );
  }

  const compliancePercentage =
    (cooperative.complianceItems.filter((item) => item.status === 'Complete')
      .length /
      cooperative.complianceItems.length) *
    100;

  return (
    <Layout title={`Dashboard - ${cooperative.name}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Anggota"
            value={formatNumber(cooperative.totalMembers)}
            subtitle={`+${cooperative.newMembersThisYear} tahun ini`}
            icon={<span className="text-2xl">👥</span>}
          />
          <MetricCard
            title="Total Simpanan"
            value={formatCurrency(cooperative.totalSavings)}
            icon={<span className="text-2xl">💰</span>}
          />
          <MetricCard
            title="Total Pinjaman"
            value={formatCurrency(cooperative.totalLoanPortfolio)}
            icon={<span className="text-2xl">💳</span>}
          />
          <MetricCard
            title="NPL"
            value={`${cooperative.delinquencyRate}%`}
            subtitle={
              cooperative.delinquencyRate > 5 ? 'Perlu perhatian' : 'Dalam batas normal'
            }
            icon={<span className="text-2xl">⚠️</span>}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Pertumbuhan Anggota</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={cooperative.memberGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="members"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Anggota"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Tren Keuangan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cooperative.financialTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="assets" fill="#10b981" name="Aset" />
                <Bar dataKey="liabilities" fill="#ef4444" name="Liabilitas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Status Audit Terakhir</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tanggal Audit:</span>
                <span className="font-medium">
                  {formatDate(cooperative.lastAuditDate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Skor Kesehatan:</span>
                <span className="font-semibold text-2xl text-blue-600">
                  {cooperative.healthScore}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tingkat Risiko:</span>
                <Badge
                  color={
                    cooperative.riskLevel === 'Low'
                      ? 'green'
                      : cooperative.riskLevel === 'Medium'
                      ? 'yellow'
                      : 'red'
                  }
                >
                  {cooperative.riskLevel}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kepatuhan:</span>
                <span className="font-medium">
                  {compliancePercentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Dokumen Kepatuhan</h3>
            <div className="space-y-2">
              {cooperative.complianceItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border-b border-gray-100"
                >
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <Badge
                    color={
                      item.status === 'Complete'
                        ? 'green'
                        : item.status === 'Pending'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate(`/cooperatives/${cooperative.id}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Lihat Detail Lengkap →
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardHome;
