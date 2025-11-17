import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Layout from '../components/layout/Layout';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatCurrency, formatNumber, formatDate } from '../utils/helpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { cooperatives } = useData();
  const [sortBy, setSortBy] = useState('healthScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterRisk, setFilterRisk] = useState('All');

  const filteredCooperatives = cooperatives.filter((coop) => {
    if (filterRisk === 'All') return true;
    return coop.riskLevel === filterRisk;
  });

  const sortedCooperatives = [...filteredCooperatives].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'healthScore') {
      return (a.healthScore - b.healthScore) * multiplier;
    } else if (sortBy === 'members') {
      return (a.totalMembers - b.totalMembers) * multiplier;
    } else if (sortBy === 'assets') {
      return (a.totalAssets - b.totalAssets) * multiplier;
    } else if (sortBy === 'npl') {
      return (a.delinquencyRate - b.delinquencyRate) * multiplier;
    } else if (sortBy === 'compliance') {
      const aCompliance =
        (a.complianceItems.filter((i) => i.status === 'Complete').length /
          a.complianceItems.length) *
        100;
      const bCompliance =
        (b.complianceItems.filter((i) => i.status === 'Complete').length /
          b.complianceItems.length) *
        100;
      return (aCompliance - bCompliance) * multiplier;
    }
    return 0;
  });

  const riskDistribution = {
    Low: cooperatives.filter((c) => c.riskLevel === 'Low').length,
    Medium: cooperatives.filter((c) => c.riskLevel === 'Medium').length,
    High: cooperatives.filter((c) => c.riskLevel === 'High').length,
  };

  const avgHealthScore =
    cooperatives.reduce((sum, c) => sum + c.healthScore, 0) /
    cooperatives.length;

  const totalMembers = cooperatives.reduce((sum, c) => sum + c.totalMembers, 0);
  const avgCompliance =
    cooperatives.reduce((sum, c) => {
      const compliance =
        (c.complianceItems.filter((i) => i.status === 'Complete').length /
          c.complianceItems.length) *
        100;
      return sum + compliance;
    }, 0) / cooperatives.length;

  const healthScoreRanking = [...cooperatives]
    .sort((a, b) => b.healthScore - a.healthScore)
    .map((c) => ({
      name: c.code,
      score: c.healthScore,
      fill:
        c.healthScore >= 80 ? '#10b981' : c.healthScore >= 60 ? '#f59e0b' : '#ef4444',
    }));

  return (
    <Layout title="Analisis & Perbandingan">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600">Rata-rata Skor Kesehatan</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {avgHealthScore.toFixed(1)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600">Koperasi High Risk</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {riskDistribution.High}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600">Total Anggota</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatNumber(totalMembers)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600">Rata-rata Kepatuhan</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {avgCompliance.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Peringkat Skor Kesehatan Koperasi
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={healthScoreRanking} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="score" name="Skor Kesehatan" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tabel Perbandingan</h3>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter Risiko
                </label>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="All">Semua</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urutkan Berdasarkan
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="healthScore">Skor Kesehatan</option>
                  <option value="members">Jumlah Anggota</option>
                  <option value="assets">Total Aset</option>
                  <option value="npl">NPL</option>
                  <option value="compliance">Kepatuhan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urutan
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="desc">Tertinggi</option>
                  <option value="asc">Terendah</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Peringkat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Koperasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Skor Kesehatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Risiko
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Anggota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Aset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    NPL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kepatuhan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Audit Terakhir
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCooperatives.map((coop, index) => {
                  const compliancePercentage =
                    (coop.complianceItems.filter((i) => i.status === 'Complete')
                      .length /
                      coop.complianceItems.length) *
                    100;

                  return (
                    <tr
                      key={coop.id}
                      onClick={() => navigate(`/cooperatives/${coop.id}`)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{coop.name}</div>
                        <div className="text-sm text-gray-500">{coop.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-lg font-bold ${
                            coop.healthScore >= 80
                              ? 'text-green-600'
                              : coop.healthScore >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {coop.healthScore}
                        </span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(coop.totalMembers)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(coop.totalAssets)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            coop.delinquencyRate > 5
                              ? 'text-red-600'
                              : 'text-gray-900'
                          }`}
                        >
                          {coop.delinquencyRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {compliancePercentage.toFixed(0)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(coop.lastAuditDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalysisPage;
