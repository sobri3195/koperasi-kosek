export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const getRiskColor = (riskLevel) => {
  const colors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };
  return colors[riskLevel] || 'bg-gray-100 text-gray-800';
};

export const getStatusColor = (status) => {
  const colors = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Complete: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Missing: 'bg-red-100 text-red-800',
    Open: 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    Closed: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getHealthScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getHealthScoreBgColor = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const calculateCompliancePercentage = (items) => {
  if (!items || items.length === 0) return 0;
  const completed = items.filter((item) => item.status === 'Complete').length;
  return Math.round((completed / items.length) * 100);
};

export const getTrendIcon = (current, previous) => {
  if (current > previous) return '↑';
  if (current < previous) return '↓';
  return '→';
};

export const getTrendColor = (current, previous, inverse = false) => {
  const isPositive = current > previous;
  if (inverse) {
    return isPositive ? 'text-red-500' : 'text-green-500';
  }
  return isPositive ? 'text-green-500' : 'text-red-500';
};
