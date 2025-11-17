import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Layout from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { DEMO_USERS } from '../data/mockData';

const CooperativeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCooperativeById, addCooperative, updateCooperative } = useData();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    region: '',
    type: 'Simpan Pinjam',
    status: 'Active',
    managerId: '',
    yearEstablished: new Date().getFullYear(),
    address: '',
    contactPerson: '',
    contactPhone: '',
    assignedAuditor: 'Auditor Pengawas',
    assignedAnalyst: 'Analis Keuangan',
    totalMembers: 0,
    newMembersThisYear: 0,
    resignedMembers: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    equity: 0,
    totalSavings: 0,
    totalLoanPortfolio: 0,
    delinquencyRate: 0,
    liquidityRatio: 0,
    solvencyRatio: 0,
    healthScore: 50,
    riskLevel: 'Medium',
    complianceScore: 0,
    lastAuditDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isEdit) {
      const cooperative = getCooperativeById(id);
      if (cooperative) {
        setFormData(cooperative);
      }
    }
  }, [id, isEdit, getCooperativeById]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      memberGrowth: formData.memberGrowth || [],
      financialTrend: formData.financialTrend || [],
      healthDimensions: formData.healthDimensions || {
        capital: 50,
        assetQuality: 50,
        management: 50,
        earnings: 50,
        liquidity: 50,
      },
      complianceItems: formData.complianceItems || [
        { name: 'Laporan Tahunan 2023', status: 'Pending', dueDate: '2024-03-31' },
        { name: 'Notulen Rapat Anggota Tahunan', status: 'Pending', dueDate: '2024-04-30' },
        { name: 'Laporan Audit Internal', status: 'Pending', dueDate: '2024-02-28' },
        { name: 'Laporan Keuangan Q1 2024', status: 'Pending', dueDate: '2024-04-15' },
      ],
    };

    if (isEdit) {
      updateCooperative(id, dataToSave);
    } else {
      addCooperative(dataToSave);
    }

    navigate('/cooperatives');
  };

  const managers = DEMO_USERS.filter((u) => u.role === 'manager');

  return (
    <Layout title={isEdit ? 'Edit Koperasi' : 'Tambah Koperasi'}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Koperasi *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region *
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Simpan Pinjam">Simpan Pinjam</option>
                  <option value="Konsumsi">Konsumsi</option>
                  <option value="Serba Usaha">Serba Usaha</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahun Berdiri *
                </label>
                <input
                  type="number"
                  name="yearEstablished"
                  value={formData.yearEstablished}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager Koperasi
                </label>
                <select
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Belum ditentukan</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kontak Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telepon
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Data Keanggotaan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Anggota
                </label>
                <input
                  type="number"
                  name="totalMembers"
                  value={formData.totalMembers}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anggota Baru (Tahun Ini)
                </label>
                <input
                  type="number"
                  name="newMembersThisYear"
                  value={formData.newMembersThisYear}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anggota Keluar
                </label>
                <input
                  type="number"
                  name="resignedMembers"
                  value={formData.resignedMembers}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Data Keuangan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Aset
                </label>
                <input
                  type="number"
                  name="totalAssets"
                  value={formData.totalAssets}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Liabilitas
                </label>
                <input
                  type="number"
                  name="totalLiabilities"
                  value={formData.totalLiabilities}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ekuitas
                </label>
                <input
                  type="number"
                  name="equity"
                  value={formData.equity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Simpanan
                </label>
                <input
                  type="number"
                  name="totalSavings"
                  value={formData.totalSavings}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Pinjaman
                </label>
                <input
                  type="number"
                  name="totalLoanPortfolio"
                  value={formData.totalLoanPortfolio}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPL (%)
                </label>
                <input
                  type="number"
                  name="delinquencyRate"
                  value={formData.delinquencyRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rasio Likuiditas
                </label>
                <input
                  type="number"
                  name="liquidityRatio"
                  value={formData.liquidityRatio}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rasio Solvabilitas
                </label>
                <input
                  type="number"
                  name="solvencyRatio"
                  value={formData.solvencyRatio}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Penilaian</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skor Kesehatan (0-100)
                </label>
                <input
                  type="number"
                  name="healthScore"
                  value={formData.healthScore}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tingkat Risiko
                </label>
                <select
                  name="riskLevel"
                  value={formData.riskLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Audit Terakhir
                </label>
                <input
                  type="date"
                  name="lastAuditDate"
                  value={formData.lastAuditDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/cooperatives')}
            >
              Batal
            </Button>
            <Button type="submit">{isEdit ? 'Update' : 'Simpan'}</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CooperativeForm;
