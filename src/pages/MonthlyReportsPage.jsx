import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

const MonthlyReportsPage = () => {
  const { currentUser, hasPermission } = useAuth();
  const { monthlyReports, cooperatives } = useData();
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterCoop, setFilterCoop] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  if (!currentUser) return null;

  const simpanPinjamCoops = cooperatives.filter(c => c.type === 'Simpan Pinjam');

  const filteredReports = monthlyReports.filter((report) => {
    if (filterMonth !== 'all' && report.month !== filterMonth) return false;
    if (filterCoop !== 'all' && report.cooperativeId !== parseInt(filterCoop)) return false;
    if (filterStatus !== 'all' && report.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    const variants = {
      'Complete': 'success',
      'Pending Review': 'warning',
      'Draft': 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const uniqueMonths = [...new Set(monthlyReports.map(r => r.month))].sort().reverse();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Bulanan Koperasi Simpan Pinjam</h1>
          <p className="text-gray-600 mt-1">
            Laporan bulanan dari Asisten, Kepala Satrad, dan analisis Kosek III
          </p>
        </div>
        {hasPermission('add_monthly_report') && (
          <Link to="/monthly-reports/new">
            <Button>+ Tambah Laporan Baru</Button>
          </Link>
        )}
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Bulan
            </label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Bulan</option>
              {uniqueMonths.map((month) => (
                <option key={month} value={month}>
                  {new Date(month + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Koperasi
            </label>
            <select
              value={filterCoop}
              onChange={(e) => setFilterCoop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Koperasi</option>
              {simpanPinjamCoops.map((coop) => (
                <option key={coop.id} value={coop.id}>
                  {coop.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="Complete">Complete</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bulan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Koperasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NPL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penilaian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Submit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data laporan bulanan
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.monthLabel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.cooperativeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.assistantReport?.npl ? `${report.assistantReport.npl}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.kosekAnalysis?.overallAssessment ? (
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
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.submittedDate).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/monthly-reports/${report.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistik Laporan</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Laporan</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">
              {monthlyReports.length}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Complete</div>
            <div className="text-2xl font-bold text-green-700 mt-1">
              {monthlyReports.filter(r => r.status === 'Complete').length}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-600 font-medium">Pending Review</div>
            <div className="text-2xl font-bold text-yellow-700 mt-1">
              {monthlyReports.filter(r => r.status === 'Pending Review').length}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Koperasi Aktif</div>
            <div className="text-2xl font-bold text-purple-700 mt-1">
              {simpanPinjamCoops.filter(c => c.status === 'Active').length}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MonthlyReportsPage;
