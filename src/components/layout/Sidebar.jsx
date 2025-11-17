import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { currentUser, hasPermission } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '📊',
      permission: null,
    },
    {
      name: 'Master Koperasi',
      path: '/cooperatives',
      icon: '🏢',
      permission: 'view_all',
    },
    {
      name: 'Analisis',
      path: '/analysis',
      icon: '📈',
      permission: 'view_analytics',
    },
    {
      name: 'Audit & Follow-Up',
      path: '/audits',
      icon: '📋',
      permission: 'view_all',
    },
    {
      name: 'Laporan',
      path: '/reports',
      icon: '📑',
      permission: 'view_analytics',
    },
    {
      name: 'Pengaturan Demo',
      path: '/settings',
      icon: '⚙️',
      permission: null,
    },
  ];

  const filteredNavigation = navigation.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <div className="w-64 bg-gray-900 min-h-screen flex flex-col">
      <div className="flex items-center justify-center h-16 bg-gray-800 px-4">
        <h1 className="text-white text-xl font-bold">Kosek III</h1>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="mb-6 p-3 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Logged in as</p>
          <p className="text-sm text-white font-medium">{currentUser?.name}</p>
          <p className="text-xs text-gray-400 mt-1">{currentUser?.roleLabel}</p>
        </div>

        <nav className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.path || 
                           location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          Demo Dashboard v1.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
