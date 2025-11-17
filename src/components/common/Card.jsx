export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

export const MetricCard = ({ title, value, subtitle, icon, trend }) => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className={`text-sm font-medium ${trend.color}`}>
            {trend.icon} {trend.text}
          </span>
        </div>
      )}
    </Card>
  );
};
