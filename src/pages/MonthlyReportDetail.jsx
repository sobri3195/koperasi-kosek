import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatCurrency } from '../utils/helpers';

const MonthlyReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMonthlyReportById, getCooperativeById } = useData();
  const { hasPermission } = useAuth();

  const report = getMonthlyReportById(id);

  if (!report) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800">Laporan tidak ditemukan</h2>
        <Link to="/monthly-reports">
          <Button className="mt-4">Kembali ke Daftar Laporan</Button>
        </Link>
      </div>
    );
  }

  const cooperative = getCooperativeById(report.cooperativeId);

  const getStatusBadge = (status) => {
    const variants = {
      'Complete': 'success',
      'Pending Review': 'warning',
      'Draft': 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Detail Laporan Bulanan</h1>
          <p className="text-gray-600 mt-1">
            {report.cooperativeName} - {report.monthLabel}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/monthly-reports')}>
            Kembali
          </Button>
          {hasPermission('manage_monthly_reports') && (
            <Link to={`/monthly-reports/${id}/edit`}>
              <Button>Edit Laporan</Button>
            </Link>
          )}
        </div>
      </div>

      <Card>
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Informasi Laporan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Koperasi</label>
            <p className="text-gray-900 font-medium">{report.cooperativeName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Periode</label>
            <p className="text-gray-900 font-medium">{report.monthLabel}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">{getStatusBadge(report.status)}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Tanggal Submit</label>
            <p className="text-gray-900 font-medium">
              {new Date(report.submittedDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Disubmit Oleh</label>
            <p className="text-gray-900 font-medium">{report.submittedBy}</p>
          </div>
          {cooperative && (
            <div>
              <label className="text-sm font-medium text-gray-500">Kode Koperasi</label>
              <p className="text-gray-900 font-medium">{cooperative.code}</p>
            </div>
          )}
        </div>
      </Card>

      {report.assistantReport && (
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Laporan Asisten Kepala Satrad</h2>
              <Badge variant="primary">Asisten</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Disubmit oleh {report.assistantReport.submittedBy} pada{' '}
              {new Date(report.assistantReport.submittedDate).toLocaleDateString('id-ID')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total Anggota</div>
              <div className="text-2xl font-bold text-blue-700 mt-1">
                {report.assistantReport.totalMembers?.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                +{report.assistantReport.newMembers} baru | -{report.assistantReport.resignedMembers} keluar
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Total Simpanan</div>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {formatCurrency(report.assistantReport.totalSavings)}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Total Pinjaman</div>
              <div className="text-2xl font-bold text-purple-700 mt-1">
                {formatCurrency(report.assistantReport.totalLoans)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Pencairan Pinjaman</label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(report.assistantReport.loanDisbursement)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Pembayaran Pinjaman</label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(report.assistantReport.loanRepayment)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Pendapatan Operasional</label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(report.assistantReport.operationalIncome)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Biaya Operasional</label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(report.assistantReport.operationalExpense)}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-yellow-600 font-medium">NPL (Non Performing Loan)</div>
                <div className="text-3xl font-bold text-yellow-700 mt-1">
                  {report.assistantReport.npl}%
                </div>
              </div>
              <Badge variant={report.assistantReport.npl < 5 ? 'success' : report.assistantReport.npl < 10 ? 'warning' : 'danger'}>
                {report.assistantReport.npl < 5 ? 'Sehat' : report.assistantReport.npl < 10 ? 'Perhatian' : 'Kritis'}
              </Badge>
            </div>
          </div>

          {report.assistantReport.notes && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Catatan</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{report.assistantReport.notes}</p>
              </div>
            </div>
          )}
        </Card>
      )}

      {report.satradHeadReport && (
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Laporan Kepala Satrad</h2>
              <Badge variant="info">Kepala Satrad</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Disubmit oleh {report.satradHeadReport.submittedBy} pada{' '}
              {new Date(report.satradHeadReport.submittedDate).toLocaleDateString('id-ID')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-sm text-indigo-600 font-medium">Kunjungan Monitoring</div>
              <div className="text-2xl font-bold text-indigo-700 mt-1">
                {report.satradHeadReport.monitoringVisits}
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-red-600 font-medium">Masalah Ditemukan</div>
              <div className="text-2xl font-bold text-red-700 mt-1">
                {report.satradHeadReport.issuesFound}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Masalah Terselesaikan</div>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {report.satradHeadReport.issuesResolved}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Skor Kepatuhan</div>
              <div className="text-2xl font-bold text-blue-700 mt-1">
                {report.satradHeadReport.complianceScore}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {report.satradHeadReport.recommendations && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Rekomendasi</label>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700">{report.satradHeadReport.recommendations}</p>
                </div>
              </div>
            )}

            {report.satradHeadReport.nextActions && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Tindak Lanjut</label>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-700">{report.satradHeadReport.nextActions}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {report.kosekAnalysis && (
        <Card>
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Analisis Kosek III</h2>
              <Badge
                variant={
                  report.kosekAnalysis.overallAssessment === 'Sangat Baik'
                    ? 'success'
                    : report.kosekAnalysis.overallAssessment === 'Baik'
                    ? 'primary'
                    : report.kosekAnalysis.overallAssessment === 'Cukup'
                    ? 'warning'
                    : 'danger'
                }
              >
                {report.kosekAnalysis.overallAssessment}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Dianalisis oleh {report.kosekAnalysis.analyzedBy} pada{' '}
              {new Date(report.kosekAnalysis.analyzedDate).toLocaleDateString('id-ID')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {report.kosekAnalysis.strengthPoints && report.kosekAnalysis.strengthPoints.length > 0 && (
              <div>
                <label className="text-sm font-medium text-green-700 block mb-2">Kekuatan</label>
                <ul className="space-y-2">
                  {report.kosekAnalysis.strengthPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {report.kosekAnalysis.concernPoints && report.kosekAnalysis.concernPoints.length > 0 && (
              <div>
                <label className="text-sm font-medium text-red-700 block mb-2">Perhatian</label>
                <ul className="space-y-2">
                  {report.kosekAnalysis.concernPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {report.kosekAnalysis.recommendations && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 block mb-2">Rekomendasi Kosek III</label>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-gray-700">{report.kosekAnalysis.recommendations}</p>
              </div>
            </div>
          )}

          {report.kosekAnalysis.followUpRequired !== undefined && (
            <div className="flex items-center p-4 rounded-lg" style={{
              backgroundColor: report.kosekAnalysis.followUpRequired ? '#FEF3C7' : '#D1FAE5'
            }}>
              <svg
                className={`w-6 h-6 mr-3 ${report.kosekAnalysis.followUpRequired ? 'text-yellow-600' : 'text-green-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className={`font-semibold ${report.kosekAnalysis.followUpRequired ? 'text-yellow-800' : 'text-green-800'}`}>
                  {report.kosekAnalysis.followUpRequired ? 'Memerlukan Tindak Lanjut' : 'Tidak Memerlukan Tindak Lanjut'}
                </p>
                <p className={`text-sm ${report.kosekAnalysis.followUpRequired ? 'text-yellow-700' : 'text-green-700'}`}>
                  {report.kosekAnalysis.followUpRequired
                    ? 'Laporan ini memerlukan perhatian dan tindak lanjut lebih lanjut'
                    : 'Koperasi dalam kondisi baik dan tidak memerlukan tindak lanjut khusus'}
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default MonthlyReportDetail;
