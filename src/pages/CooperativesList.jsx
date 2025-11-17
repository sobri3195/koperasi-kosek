import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Layout from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatDate } from '../utils/helpers';

const CooperativesList = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { cooperatives, deleteCooperative } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [filterRegion, setFilterRegion] = useState('All');

  const regions = [...new Set(cooperatives.map((c) => c.region))];

  const filteredCooperatives = cooperatives.filter((coop) => {
    const matchesSearch =
      coop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coop.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'All' || coop.status === filterStatus;
    const matchesRisk = filterRisk === 'All' || coop.riskLevel === filterRisk;
    const matchesRegion =
      filterRegion === 'All' || coop.region === filterRegion;

    return matchesSearch && matchesStatus && matchesRisk && matchesRegion;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${name}?`)) {
      deleteCooperative(id);
    }
  };

  const canEdit = hasPermission('edit_all');

  return (
    <Layout title="Master Koperasi">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari nama atau kode koperasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {canEdit && (
            <Button onClick={() => navigate('/cooperatives/new')}>
              + Tambah Koperasi
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">Semua</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risiko
              </label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">Semua</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">Semua</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {(searchTerm || filterStatus !== 'All' || filterRisk !== 'All' || filterRegion !== 'All') && (
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('All');
                    setFilterRisk('All');
                    setFilterRegion('All');
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
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
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
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
                  {canEdit && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCooperatives.map((coop) => (
                  <tr
                    key={coop.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => {
                      if (!e.target.closest('button')) {
                        navigate(`/cooperatives/${coop.id}`);
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {coop.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coop.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coop.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coop.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        color={coop.status === 'Active' ? 'green' : 'gray'}
                      >
                        {coop.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-semibold text-lg mr-2">
                          {coop.healthScore}
                        </span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
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
                    {canEdit && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              navigate(`/cooperatives/${coop.id}/edit`)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(coop.id, coop.name)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCooperatives.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Tidak ada koperasi yang sesuai dengan filter.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Menampilkan {filteredCooperatives.length} dari {cooperatives.length}{' '}
            koperasi
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CooperativesList;
