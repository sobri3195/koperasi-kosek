import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const MonthlyReportForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cooperatives, addMonthlyReport, updateMonthlyReport, getMonthlyReportById } = useData();

  const isEditMode = !!id;
  const existingReport = isEditMode ? getMonthlyReportById(id) : null;

  const simpanPinjamCoops = cooperatives.filter(c => c.type === 'Simpan Pinjam' && c.status === 'Active');

  const [formData, setFormData] = useState({
    cooperativeId: '',
    month: '',
    status: 'Draft',
    assistantReport: {
      submittedBy: 'Asisten Kepala Satrad',
      submittedDate: new Date().toISOString().split('T')[0],
      totalMembers: '',
      newMembers: '',
      resignedMembers: '',
      totalSavings: '',
      totalLoans: '',
      loanDisbursement: '',
      loanRepayment: '',
      npl: '',
      operationalIncome: '',
      operationalExpense: '',
      notes: '',
    },
    satradHeadReport: {
      submittedBy: 'Kepala Satrad',
      submittedDate: new Date().toISOString().split('T')[0],
      monitoringVisits: '',
      issuesFound: '',
      issuesResolved: '',
      complianceScore: '',
      recommendations: '',
      nextActions: '',
    },
    kosekAnalysis: {
      analyzedBy: currentUser?.name || 'Staf Kosek III',
      analyzedDate: new Date().toISOString().split('T')[0],
      overallAssessment: 'Baik',
      strengthPoints: [],
      concernPoints: [],
      recommendations: '',
      followUpRequired: false,
    },
  });

  const [strengthPointInput, setStrengthPointInput] = useState('');
  const [concernPointInput, setConcernPointInput] = useState('');

  useEffect(() => {
    if (existingReport) {
      setFormData({
        cooperativeId: existingReport.cooperativeId,
        month: existingReport.month,
        status: existingReport.status,
        assistantReport: existingReport.assistantReport,
        satradHeadReport: existingReport.satradHeadReport,
        kosekAnalysis: existingReport.kosekAnalysis,
      });
    }
  }, [existingReport]);

  const handleChange = (section, field, value) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const addStrengthPoint = () => {
    if (strengthPointInput.trim()) {
      handleChange('kosekAnalysis', 'strengthPoints', [
        ...formData.kosekAnalysis.strengthPoints,
        strengthPointInput.trim(),
      ]);
      setStrengthPointInput('');
    }
  };

  const removeStrengthPoint = (index) => {
    handleChange(
      'kosekAnalysis',
      'strengthPoints',
      formData.kosekAnalysis.strengthPoints.filter((_, i) => i !== index)
    );
  };

  const addConcernPoint = () => {
    if (concernPointInput.trim()) {
      handleChange('kosekAnalysis', 'concernPoints', [
        ...formData.kosekAnalysis.concernPoints,
        concernPointInput.trim(),
      ]);
      setConcernPointInput('');
    }
  };

  const removeConcernPoint = (index) => {
    handleChange(
      'kosekAnalysis',
      'concernPoints',
      formData.kosekAnalysis.concernPoints.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedCoop = cooperatives.find(c => c.id === parseInt(formData.cooperativeId));
    if (!selectedCoop) {
      alert('Pilih koperasi terlebih dahulu');
      return;
    }

    const monthDate = new Date(formData.month + '-01');
    const monthLabel = monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const reportData = {
      ...formData,
      cooperativeName: selectedCoop.name,
      monthLabel,
      submittedBy: currentUser?.name || 'Staf Kosek III',
      submittedById: currentUser?.id,
      submittedDate: new Date().toISOString().split('T')[0],
      assistantReport: {
        ...formData.assistantReport,
        totalMembers: parseInt(formData.assistantReport.totalMembers) || 0,
        newMembers: parseInt(formData.assistantReport.newMembers) || 0,
        resignedMembers: parseInt(formData.assistantReport.resignedMembers) || 0,
        totalSavings: parseInt(formData.assistantReport.totalSavings) || 0,
        totalLoans: parseInt(formData.assistantReport.totalLoans) || 0,
        loanDisbursement: parseInt(formData.assistantReport.loanDisbursement) || 0,
        loanRepayment: parseInt(formData.assistantReport.loanRepayment) || 0,
        npl: parseFloat(formData.assistantReport.npl) || 0,
        operationalIncome: parseInt(formData.assistantReport.operationalIncome) || 0,
        operationalExpense: parseInt(formData.assistantReport.operationalExpense) || 0,
      },
      satradHeadReport: {
        ...formData.satradHeadReport,
        monitoringVisits: parseInt(formData.satradHeadReport.monitoringVisits) || 0,
        issuesFound: parseInt(formData.satradHeadReport.issuesFound) || 0,
        issuesResolved: parseInt(formData.satradHeadReport.issuesResolved) || 0,
        complianceScore: parseInt(formData.satradHeadReport.complianceScore) || 0,
      },
    };

    if (isEditMode) {
      updateMonthlyReport(id, reportData);
    } else {
      addMonthlyReport(reportData);
    }

    navigate('/monthly-reports');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Laporan Bulanan' : 'Tambah Laporan Bulanan'}
          </h1>
          <p className="text-gray-600 mt-1">
            Input laporan dari Asisten, Kepala Satrad, dan analisis Kosek III
          </p>
        </div>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Dasar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Koperasi Simpan Pinjam <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.cooperativeId}
              onChange={(e) => handleChange(null, 'cooperativeId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Koperasi</option>
              {simpanPinjamCoops.map((coop) => (
                <option key={coop.id} value={coop.id}>
                  {coop.name} ({coop.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periode Bulan <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              value={formData.month}
              onChange={(e) => handleChange(null, 'month', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Laporan <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange(null, 'status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Draft">Draft</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Laporan Asisten Kepala Satrad</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Anggota</label>
            <input
              type="number"
              value={formData.assistantReport.totalMembers}
              onChange={(e) => handleChange('assistantReport', 'totalMembers', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anggota Baru</label>
            <input
              type="number"
              value={formData.assistantReport.newMembers}
              onChange={(e) => handleChange('assistantReport', 'newMembers', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anggota Keluar</label>
            <input
              type="number"
              value={formData.assistantReport.resignedMembers}
              onChange={(e) => handleChange('assistantReport', 'resignedMembers', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Simpanan (Rp)</label>
            <input
              type="number"
              value={formData.assistantReport.totalSavings}
              onChange={(e) => handleChange('assistantReport', 'totalSavings', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Pinjaman (Rp)</label>
            <input
              type="number"
              value={formData.assistantReport.totalLoans}
              onChange={(e) => handleChange('assistantReport', 'totalLoans', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pencairan Pinjaman (Rp)</label>
            <input
              type="number"
              value={formData.assistantReport.loanDisbursement}
              onChange={(e) => handleChange('assistantReport', 'loanDisbursement', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pembayaran Pinjaman (Rp)</label>
            <input
              type="number"
              value={formData.assistantReport.loanRepayment}
              onChange={(e) => handleChange('assistantReport', 'loanRepayment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NPL (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.assistantReport.npl}
              onChange={(e) => handleChange('assistantReport', 'npl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pendapatan Operasional (Rp)</label>
            <input
              type="number"
              value={formData.assistantReport.operationalIncome}
              onChange={(e) => handleChange('assistantReport', 'operationalIncome', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biaya Operasional (Rp)</label>
            <input
              type="number"
              value={formData.assistantReport.operationalExpense}
              onChange={(e) => handleChange('assistantReport', 'operationalExpense', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Asisten</label>
          <textarea
            value={formData.assistantReport.notes}
            onChange={(e) => handleChange('assistantReport', 'notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Catatan atau observasi dari Asisten Kepala Satrad"
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Laporan Kepala Satrad</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kunjungan Monitoring</label>
            <input
              type="number"
              value={formData.satradHeadReport.monitoringVisits}
              onChange={(e) => handleChange('satradHeadReport', 'monitoringVisits', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Masalah Ditemukan</label>
            <input
              type="number"
              value={formData.satradHeadReport.issuesFound}
              onChange={(e) => handleChange('satradHeadReport', 'issuesFound', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Masalah Terselesaikan</label>
            <input
              type="number"
              value={formData.satradHeadReport.issuesResolved}
              onChange={(e) => handleChange('satradHeadReport', 'issuesResolved', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skor Kepatuhan</label>
            <input
              type="number"
              value={formData.satradHeadReport.complianceScore}
              onChange={(e) => handleChange('satradHeadReport', 'complianceScore', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rekomendasi Kepala Satrad</label>
          <textarea
            value={formData.satradHeadReport.recommendations}
            onChange={(e) => handleChange('satradHeadReport', 'recommendations', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rekomendasi dari Kepala Satrad"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tindak Lanjut</label>
          <textarea
            value={formData.satradHeadReport.nextActions}
            onChange={(e) => handleChange('satradHeadReport', 'nextActions', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rencana tindak lanjut yang akan dilakukan"
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Analisis Kosek III</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Penilaian Keseluruhan <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.kosekAnalysis.overallAssessment}
            onChange={(e) => handleChange('kosekAnalysis', 'overallAssessment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Sangat Baik">Sangat Baik</option>
            <option value="Baik">Baik</option>
            <option value="Cukup">Cukup</option>
            <option value="Kurang">Kurang</option>
            <option value="Buruk">Buruk</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Kekuatan</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={strengthPointInput}
              onChange={(e) => setStrengthPointInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStrengthPoint())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tambahkan poin kekuatan"
            />
            <Button type="button" onClick={addStrengthPoint}>Tambah</Button>
          </div>
          {formData.kosekAnalysis.strengthPoints.length > 0 && (
            <ul className="space-y-2">
              {formData.kosekAnalysis.strengthPoints.map((point, index) => (
                <li key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                  <span className="text-gray-700">{point}</span>
                  <button
                    type="button"
                    onClick={() => removeStrengthPoint(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Perhatian</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={concernPointInput}
              onChange={(e) => setConcernPointInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConcernPoint())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tambahkan poin yang perlu diperhatikan"
            />
            <Button type="button" onClick={addConcernPoint}>Tambah</Button>
          </div>
          {formData.kosekAnalysis.concernPoints.length > 0 && (
            <ul className="space-y-2">
              {formData.kosekAnalysis.concernPoints.map((point, index) => (
                <li key={index} className="flex items-center justify-between bg-red-50 p-2 rounded">
                  <span className="text-gray-700">{point}</span>
                  <button
                    type="button"
                    onClick={() => removeConcernPoint(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rekomendasi Kosek III</label>
          <textarea
            value={formData.kosekAnalysis.recommendations}
            onChange={(e) => handleChange('kosekAnalysis', 'recommendations', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rekomendasi dan analisis dari Kosek III"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.kosekAnalysis.followUpRequired}
              onChange={(e) => handleChange('kosekAnalysis', 'followUpRequired', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Memerlukan tindak lanjut
            </span>
          </label>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/monthly-reports')}
        >
          Batal
        </Button>
        <Button type="submit">
          {isEditMode ? 'Update Laporan' : 'Simpan Laporan'}
        </Button>
      </div>
    </form>
  );
};

export default MonthlyReportForm;
