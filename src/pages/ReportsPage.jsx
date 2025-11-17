import { useData } from '../context/DataContext';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { formatCurrency, formatNumber, exportToCSV } from '../utils/helpers';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { HEALTH_SCORE_HISTORY } from '../data/mockData';

const ReportsPage = () => {
  const { cooperatives } = useData();

  const totalCooperatives = cooperatives.length;
  const activeCooperatives = cooperatives.filter((c) => c.status === 'Active').length;
  const totalMembers = cooperatives.reduce((sum, c) => sum + c.totalMembers, 0);
  const totalAssets = cooperatives.reduce((sum, c) => sum + c.totalAssets, 0);
  const totalLiabilities = cooperatives.reduce((sum, c) => sum + c.totalLiabilities, 0);
  const totalEquity = cooperatives.reduce((sum, c) => sum + c.equity, 0);
  const avgHealthScore =
    cooperatives.reduce((sum, c) => sum + c.healthScore, 0) / cooperatives.length;

  const riskDistribution = [
    {
      name: 'Low Risk',
      value: cooperatives.filter((c) => c.riskLevel === 'Low').length,
      color: '#10b981',
    },
    {
      name: 'Medium Risk',
      value: cooperatives.filter((c) => c.riskLevel === 'Medium').length,
      color: '#f59e0b',
    },
    {
      name: 'High Risk',
      value: cooperatives.filter((c) => c.riskLevel === 'High').length,
      color: '#ef4444',
    },
  ];

  const typeDistribution = [
    {
      name: 'Simpan Pinjam',
      value: cooperatives.filter((c) => c.type === 'Simpan Pinjam').length,
      color: '#3b82f6',
    },
    {
      name: 'Konsumsi',
      value: cooperatives.filter((c) => c.type === 'Konsumsi').length,
      color: '#8b5cf6',
    },
    {
      name: 'Serba Usaha',
      value: cooperatives.filter((c) => c.type === 'Serba Usaha').length,
      color: '#ec4899',
    },
  ];

  const avgCompliance =
    cooperatives.reduce((sum, c) => {
      const compliance =
        (c.complianceItems.filter((i) => i.status === 'Complete').length /
          c.complianceItems.length) *
        100;
      return sum + compliance;
    }, 0) / cooperatives.length;

  const highRiskCooperatives = cooperatives.filter((c) => c.riskLevel === 'High');

  const handleExportSummary = () => {
    const data = cooperatives.map((coop) => ({
      Kode: coop.code,
      Nama: coop.name,
      Region: coop.region,
      Tipe: coop.type,
      Status: coop.status,
      'Skor Kesehatan': coop.healthScore,
      'Tingkat Risiko': coop.riskLevel,
      'Total Anggota': coop.totalMembers,
      'Total Aset': coop.totalAssets,
      'Total Liabilitas': coop.totalLiabilities,
      Ekuitas: coop.equity,
      'NPL (%)': coop.delinquencyRate,
      'Rasio Likuiditas': coop.liquidityRatio,
      'Rasio Solvabilitas': coop.solvencyRatio,
    }));

    exportToCSV(data, 'laporan-koperasi-kosek3.csv');
  };

  const handleExportHighRisk = () => {
    const data = highRiskCooperatives.map((coop) => ({
      Kode: coop.code,
      Nama: coop.name,
      Region: coop.region,
      'Skor Kesehatan': coop.healthScore,
      'Total Anggota': coop.totalMembers,
      'NPL (%)': coop.delinquencyRate,
      'Audit Terakhir': coop.lastAuditDate,
    }));

    exportToCSV(data, 'koperasi-high-risk.csv');
  };

  return (
    <Layout title="Laporan & Analitik">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={handleExportSummary}>📥 Export Laporan Lengkap (CSV)</Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Ringkasan Eksekutif</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Koperasi yang Dianalisis
              </h4>
              <p className="text-3xl font-bold text-gray-900">{totalCooperatives}</p>
              <p className="text-sm text-gray-500 mt-1">
                {activeCooperatives} aktif, {totalCooperatives - activeCooperatives}{' '}
                tidak aktif
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Rata-rata Skor Kesehatan
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                {avgHealthScore.toFixed(1)}
              </p>
              <p className="text-sm text-gray-500 mt-1">dari 100</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Koperasi High Risk
              </h4>
              <p className="text-3xl font-bold text-red-600">
                {highRiskCooperatives.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {((highRiskCooperatives.length / totalCooperatives) * 100).toFixed(1)}%
                dari total
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h4 className="text-sm font-medium text-gray-600 mb-3">Total Anggota</h4>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(totalMembers)}
            </p>
          </Card>

          <Card>
            <h4 className="text-sm font-medium text-gray-600 mb-3">Total Aset</h4>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalAssets)}
            </p>
          </Card>

          <Card>
            <h4 className="text-sm font-medium text-gray-600 mb-3">
              Total Liabilitas
            </h4>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalLiabilities)}
            </p>
          </Card>

          <Card>
            <h4 className="text-sm font-medium text-gray-600 mb-3">Total Ekuitas</h4>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalEquity)}
            </p>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Tren Skor Kesehatan per Kuartal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={HEALTH_SCORE_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Rata-rata Skor Kesehatan"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Distribusi Risiko</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Distribusi Tipe Koperasi</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Jumlah">
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Koperasi High Risk ({highRiskCooperatives.length})
            </h3>
            {highRiskCooperatives.length > 0 && (
              <Button variant="secondary" size="sm" onClick={handleExportHighRisk}>
                📥 Export High Risk
              </Button>
            )}
          </div>

          {highRiskCooperatives.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Tidak ada koperasi dengan risiko tinggi.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Koperasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Region
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Skor Kesehatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      NPL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Anggota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {highRiskCooperatives.map((coop) => (
                    <tr key={coop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{coop.name}</div>
                        <div className="text-sm text-gray-500">{coop.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coop.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-red-600">
                          {coop.healthScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-red-600">
                          {coop.delinquencyRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(coop.totalMembers)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coop.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Metrik Kepatuhan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Rata-rata Tingkat Kepatuhan
              </h4>
              <p className="text-3xl font-bold text-green-600">
                {avgCompliance.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Dokumen lengkap dari total yang diperlukan
              </p>
            </Card>

            <Card>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Koperasi Patuh Penuh
              </h4>
              <p className="text-3xl font-bold text-green-600">
                {
                  cooperatives.filter((c) => {
                    const compliance =
                      (c.complianceItems.filter((i) => i.status === 'Complete')
                        .length /
                        c.complianceItems.length) *
                      100;
                    return compliance === 100;
                  }).length
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Semua dokumen kepatuhan lengkap
              </p>
            </Card>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Catatan:</strong> Ini adalah laporan demo yang dihasilkan dari data
            mock. Dalam sistem production, laporan ini akan mengambil data real-time
            dari database.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
