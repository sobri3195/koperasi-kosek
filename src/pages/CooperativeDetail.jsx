import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  formatCurrency,
  formatNumber,
  formatDate,
  calculateCompliancePercentage,
} from '../utils/helpers';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CooperativeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission, currentUser } = useAuth();
  const { getCooperativeById, getAuditsByCooperative, addAudit, addAuditNote } = useData();
  const [activeTab, setActiveTab] = useState('profile');

  const cooperative = getCooperativeById(id);
  const audits = getAuditsByCooperative(id);

  if (!cooperative) {
    return (
      <Layout title="Detail Koperasi">
        <div className="text-center py-12">
          <p className="text-gray-500">Koperasi tidak ditemukan.</p>
          <Button onClick={() => navigate('/cooperatives')} className="mt-4">
            Kembali ke Daftar
          </Button>
        </div>
      </Layout>
    );
  }

  const isManager = currentUser?.role === 'manager';
  const isOwnCooperative = isManager && currentUser?.cooperativeId === cooperative.id;
  const canEdit = hasPermission('edit_all') || (isManager && isOwnCooperative);
  const canAudit = hasPermission('add_audit');

  const compliancePercentage = calculateCompliancePercentage(
    cooperative.complianceItems
  );

  const tabs = [
    { id: 'profile', label: 'Profil' },
    { id: 'membership', label: 'Keanggotaan' },
    { id: 'financial', label: 'Keuangan' },
    { id: 'health', label: 'Kesehatan & Risiko' },
    { id: 'compliance', label: 'Kepatuhan' },
    { id: 'audit', label: 'Audit & Catatan' },
  ];

  return (
    <Layout title={cooperative.name}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="secondary" onClick={() => navigate('/cooperatives')}>
              ← Kembali
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {cooperative.name}
              </h2>
              <p className="text-gray-500">{cooperative.code}</p>
            </div>
          </div>
          {canEdit && (
            <Button onClick={() => navigate(`/cooperatives/${id}/edit`)}>
              Edit Data
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-gray-600">Skor Kesehatan</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {cooperative.healthScore}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600">Tingkat Risiko</p>
            <div className="mt-2">
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
          </Card>
          <Card>
            <p className="text-sm text-gray-600">Total Anggota</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatNumber(cooperative.totalMembers)}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600">Kepatuhan</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {compliancePercentage}%
            </p>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <ProfileTab cooperative={cooperative} />
            )}
            {activeTab === 'membership' && (
              <MembershipTab cooperative={cooperative} />
            )}
            {activeTab === 'financial' && (
              <FinancialTab cooperative={cooperative} />
            )}
            {activeTab === 'health' && (
              <HealthTab cooperative={cooperative} />
            )}
            {activeTab === 'compliance' && (
              <ComplianceTab cooperative={cooperative} />
            )}
            {activeTab === 'audit' && (
              <AuditTab
                cooperative={cooperative}
                audits={audits}
                canAudit={canAudit}
                addAudit={addAudit}
                addAuditNote={addAuditNote}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const ProfileTab = ({ cooperative }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Informasi Dasar</h3>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">Nama Koperasi</dt>
          <dd className="mt-1 text-sm text-gray-900">{cooperative.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Kode</dt>
          <dd className="mt-1 text-sm text-gray-900">{cooperative.code}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Tipe</dt>
          <dd className="mt-1 text-sm text-gray-900">{cooperative.type}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Status</dt>
          <dd className="mt-1">
            <Badge color={cooperative.status === 'Active' ? 'green' : 'gray'}>
              {cooperative.status}
            </Badge>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Tahun Berdiri</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {cooperative.yearEstablished}
          </dd>
        </div>
      </dl>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Kontak & Lokasi</h3>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm font-medium text-gray-500">Alamat</dt>
          <dd className="mt-1 text-sm text-gray-900">{cooperative.address}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Region</dt>
          <dd className="mt-1 text-sm text-gray-900">{cooperative.region}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Kontak Person</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {cooperative.contactPerson}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Telepon</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {cooperative.contactPhone}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Auditor</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {cooperative.assignedAuditor}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Analis</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {cooperative.assignedAnalyst}
          </dd>
        </div>
      </dl>
    </div>
  </div>
);

const MembershipTab = ({ cooperative }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <p className="text-sm text-gray-600">Total Anggota</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {formatNumber(cooperative.totalMembers)}
        </p>
      </Card>
      <Card>
        <p className="text-sm text-gray-600">Anggota Baru (Tahun Ini)</p>
        <p className="text-3xl font-bold text-green-600 mt-2">
          +{cooperative.newMembersThisYear}
        </p>
      </Card>
      <Card>
        <p className="text-sm text-gray-600">Anggota Keluar</p>
        <p className="text-3xl font-bold text-red-600 mt-2">
          -{cooperative.resignedMembers}
        </p>
      </Card>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Pertumbuhan Anggota</h3>
      <ResponsiveContainer width="100%" height={300}>
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
            name="Jumlah Anggota"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const FinancialTab = ({ cooperative }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Neraca</h3>
        <dl className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <dt className="font-medium text-gray-700">Total Aset</dt>
            <dd className="text-gray-900">
              {formatCurrency(cooperative.totalAssets)}
            </dd>
          </div>
          <div className="flex justify-between py-2 border-b">
            <dt className="font-medium text-gray-700">Total Liabilitas</dt>
            <dd className="text-gray-900">
              {formatCurrency(cooperative.totalLiabilities)}
            </dd>
          </div>
          <div className="flex justify-between py-2 border-b">
            <dt className="font-medium text-gray-700">Ekuitas</dt>
            <dd className="text-gray-900">
              {formatCurrency(cooperative.equity)}
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
        <dl className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <dt className="font-medium text-gray-700">Total Simpanan</dt>
            <dd className="text-gray-900">
              {formatCurrency(cooperative.totalSavings)}
            </dd>
          </div>
          <div className="flex justify-between py-2 border-b">
            <dt className="font-medium text-gray-700">Total Pinjaman</dt>
            <dd className="text-gray-900">
              {formatCurrency(cooperative.totalLoanPortfolio)}
            </dd>
          </div>
          <div className="flex justify-between py-2 border-b">
            <dt className="font-medium text-gray-700">NPL</dt>
            <dd
              className={
                cooperative.delinquencyRate > 5
                  ? 'text-red-600 font-semibold'
                  : 'text-gray-900'
              }
            >
              {cooperative.delinquencyRate}%
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Tren Keuangan</h3>
      <ResponsiveContainer width="100%" height={300}>
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

    <div>
      <h3 className="text-lg font-semibold mb-4">Rasio Keuangan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-gray-600">Rasio Likuiditas</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {cooperative.liquidityRatio}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {cooperative.liquidityRatio >= 1.5 ? '✓ Sehat' : '⚠ Perlu perhatian'}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Rasio Solvabilitas</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {cooperative.solvencyRatio}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {cooperative.solvencyRatio <= 0.75 ? '✓ Sehat' : '⚠ Perlu perhatian'}
          </p>
        </Card>
      </div>
    </div>
  </div>
);

const HealthTab = ({ cooperative }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Skor Kesehatan Keseluruhan</h3>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl font-bold text-blue-600">
              {cooperative.healthScore}
            </p>
            <p className="text-gray-500 mt-2">dari 100</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Tingkat Risiko</h3>
        <div className="flex items-center justify-center h-full">
          <Badge
            color={
              cooperative.riskLevel === 'Low'
                ? 'green'
                : cooperative.riskLevel === 'Medium'
                ? 'yellow'
                : 'red'
            }
            className="text-2xl px-8 py-3"
          >
            {cooperative.riskLevel}
          </Badge>
        </div>
      </Card>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Dimensi Kesehatan</h3>
      <div className="space-y-4">
        {Object.entries(cooperative.healthDimensions).map(([key, value]) => {
          const labels = {
            capital: 'Permodalan',
            assetQuality: 'Kualitas Aset',
            management: 'Manajemen & Tata Kelola',
            earnings: 'Rentabilitas',
            liquidity: 'Likuiditas',
          };
          return (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {labels[key]}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {value}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    value >= 80
                      ? 'bg-green-500'
                      : value >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-4">Indikator Risiko</h3>
      <div className="space-y-2">
        {cooperative.delinquencyRate > 5 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ NPL tinggi: {cooperative.delinquencyRate}%
            </p>
          </div>
        )}
        {cooperative.resignedMembers > cooperative.newMembersThisYear && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Penurunan keanggotaan: {cooperative.resignedMembers} keluar vs{' '}
              {cooperative.newMembersThisYear} masuk
            </p>
          </div>
        )}
        {cooperative.liquidityRatio < 1.2 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Rasio likuiditas rendah: {cooperative.liquidityRatio}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ComplianceTab = ({ cooperative }) => {
  const compliancePercentage = calculateCompliancePercentage(
    cooperative.complianceItems
  );

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Tingkat Kepatuhan</h3>
            <p className="text-sm text-gray-500 mt-1">
              {
                cooperative.complianceItems.filter(
                  (item) => item.status === 'Complete'
                ).length
              }{' '}
              dari {cooperative.complianceItems.length} dokumen lengkap
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">
              {compliancePercentage}%
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Dokumen Kepatuhan</h3>
        <div className="space-y-3">
          {cooperative.complianceItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Deadline: {formatDate(item.dueDate)}
                </p>
              </div>
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
  );
};

const AuditTab = ({ cooperative, audits, canAudit, addAudit, addAuditNote }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(null);
  const { currentUser } = useAuth();

  const handleAddAudit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    addAudit({
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      date: formData.get('date'),
      auditor: currentUser?.name,
      summary: formData.get('summary'),
      riskLevel: formData.get('riskLevel'),
      followUpStatus: 'Open',
      notes: [],
    });
    
    setShowAddForm(false);
    e.target.reset();
  };

  const handleAddNote = (auditId, e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    addAuditNote(auditId, {
      author: currentUser?.name,
      text: formData.get('note'),
    });
    
    setShowNoteForm(null);
    e.target.reset();
  };

  return (
    <div className="space-y-6">
      {canAudit && (
        <div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Batalkan' : '+ Tambah Audit'}
          </Button>

          {showAddForm && (
            <form onSubmit={handleAddAudit} className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ringkasan
                  </label>
                  <textarea
                    name="summary"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tingkat Risiko
                  </label>
                  <select
                    name="riskLevel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <Button type="submit">Simpan Audit</Button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="space-y-4">
        {audits.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Belum ada catatan audit.
          </p>
        ) : (
          audits.map((audit) => (
            <div key={audit.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {formatDate(audit.date)}
                  </p>
                  <p className="text-sm text-gray-500">Auditor: {audit.auditor}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge
                    color={
                      audit.riskLevel === 'Low'
                        ? 'green'
                        : audit.riskLevel === 'Medium'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {audit.riskLevel}
                  </Badge>
                  <Badge
                    color={
                      audit.followUpStatus === 'Closed'
                        ? 'gray'
                        : audit.followUpStatus === 'In Progress'
                        ? 'yellow'
                        : 'blue'
                    }
                  >
                    {audit.followUpStatus}
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{audit.summary}</p>

              {audit.notes && audit.notes.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Catatan:</p>
                  {audit.notes.map((note, index) => (
                    <div key={index} className="pl-4 border-l-2 border-blue-200">
                      <p className="text-sm text-gray-600">{note.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {note.author} - {formatDate(note.date)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {canAudit && (
                <div className="mt-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setShowNoteForm(showNoteForm === audit.id ? null : audit.id)
                    }
                  >
                    + Tambah Catatan
                  </Button>

                  {showNoteForm === audit.id && (
                    <form
                      onSubmit={(e) => handleAddNote(audit.id, e)}
                      className="mt-2"
                    >
                      <textarea
                        name="note"
                        required
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Tulis catatan..."
                      />
                      <div className="mt-2 space-x-2">
                        <Button type="submit" size="sm">
                          Simpan
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setShowNoteForm(null)}
                        >
                          Batal
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CooperativeDetail;
