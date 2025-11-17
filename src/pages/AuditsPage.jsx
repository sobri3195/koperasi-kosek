import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Layout from '../components/layout/Layout';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatDate } from '../utils/helpers';

const AuditsPage = () => {
  const navigate = useNavigate();
  const { audits, tasks, updateTask } = useData();
  const [activeTab, setActiveTab] = useState('audits');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCooperative, setFilterCooperative] = useState('All');

  const cooperativeNames = [
    ...new Set(audits.map((a) => a.cooperativeName)),
  ];

  const filteredAudits = audits.filter((audit) => {
    if (filterCooperative !== 'All' && audit.cooperativeName !== filterCooperative) {
      return false;
    }
    if (filterStatus !== 'All' && audit.followUpStatus !== filterStatus) {
      return false;
    }
    return true;
  });

  const filteredTasks = tasks.filter((task) => {
    if (filterCooperative !== 'All' && task.cooperativeName !== filterCooperative) {
      return false;
    }
    if (filterStatus !== 'All' && task.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const handleTaskStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <Layout title="Audit & Follow-Up">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('audits')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'audits'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Daftar Audit
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tasks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Tugas & Follow-Up
              </button>
            </nav>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Koperasi
                </label>
                <select
                  value={filterCooperative}
                  onChange={(e) => setFilterCooperative(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="All">Semua</option>
                  {cooperativeNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="All">Semua</option>
                  {activeTab === 'audits' ? (
                    <>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </>
                  ) : (
                    <>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </>
                  )}
                </select>
              </div>

              {(filterStatus !== 'All' || filterCooperative !== 'All') && (
                <div className="pt-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setFilterStatus('All');
                      setFilterCooperative('All');
                    }}
                  >
                    Reset
                  </Button>
                </div>
              )}
            </div>

            {activeTab === 'audits' && (
              <div className="space-y-4">
                {filteredAudits.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Tidak ada audit yang sesuai filter.
                  </p>
                ) : (
                  filteredAudits.map((audit) => (
                    <div
                      key={audit.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/cooperatives/${audit.cooperativeId}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {audit.cooperativeName}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(audit.date)} - {audit.auditor}
                          </p>
                          <p className="text-sm text-gray-700 mt-2">
                            {audit.summary}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
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
                      {audit.notes && audit.notes.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            {audit.notes.length} catatan follow-up
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Koperasi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Deskripsi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Deadline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Penanggung Jawab
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          Tidak ada tugas yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task) => {
                        const dueDate = new Date(task.dueDate);
                        const today = new Date();
                        const isOverdue = dueDate < today && task.status !== 'Closed';

                        return (
                          <tr key={task.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {task.cooperativeName}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {task.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className={`text-sm ${
                                  isOverdue
                                    ? 'text-red-600 font-semibold'
                                    : 'text-gray-900'
                                }`}
                              >
                                {formatDate(task.dueDate)}
                                {isOverdue && ' (Terlambat)'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {task.responsiblePerson}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                color={
                                  task.status === 'Closed'
                                    ? 'gray'
                                    : task.status === 'In Progress'
                                    ? 'yellow'
                                    : 'blue'
                                }
                              >
                                {task.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={task.status}
                                onChange={(e) =>
                                  handleTaskStatusChange(task.id, e.target.value)
                                }
                                className="text-sm px-2 py-1 border border-gray-300 rounded"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600">Total Audit</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {audits.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600">Total Tugas</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {tasks.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600">Tugas Terbuka</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {tasks.filter((t) => t.status === 'Open').length}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuditsPage;
