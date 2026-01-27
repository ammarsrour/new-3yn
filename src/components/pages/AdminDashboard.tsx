import React, { useEffect, useState } from 'react';
import {
  Activity,
  Upload,
  Download,
  BarChart3,
  Filter,
  FileText,
  Users,
  Calendar
} from 'lucide-react';
import { activityLogger } from '../../services/activityLogger';
import ActivityTable from '../admin/ActivityTable';
import FileActivityTable from '../admin/FileActivityTable';
import SummaryCard from '../admin/SummaryCard';
import { supabase } from '../../services/supabaseAuth';
import { reportStorage } from '../../services/reportStorage';

interface ActivitySummary {
  totalActivities: number;
  analyses: number;
  uploads: number;
  downloads: number;
}

interface AdminDashboardProps {
  userId: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userId }) => {
  const [summary, setSummary] = useState<ActivitySummary>({
    totalActivities: 0,
    analyses: 0,
    uploads: 0,
    downloads: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [fileActivities, setFileActivities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryData, activitiesData, filesData, usersData] = await Promise.all([
        activityLogger.getActivitySummary(),
        activityLogger.getAllActivities(200),
        activityLogger.getAllFileActivities(200),
        fetchUsers(),
      ]);

      setSummary(summaryData);
      setActivities(activitiesData);
      setFileActivities(filesData);
      setUsers(usersData);
    } catch {
      // Silently handle error - data will be empty
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, company_name')
        .order('email');

      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  };

  const filteredActivities = selectedUser === 'all'
    ? activities
    : activities.filter(a => a.user_id === selectedUser);

  const filteredFileActivities = selectedUser === 'all'
    ? fileActivities
    : fileActivities.filter(f => f.user_id === selectedUser);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = 'No activities to export';
      document.body.appendChild(toast);
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 3000);
      return;
    }

    try {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row =>
          headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) {
              return '';
            }
            if (typeof value === 'object') {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = `Exported ${data.length} activities to CSV`;
      document.body.appendChild(toast);
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 3000);
    } catch {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = 'Failed to export CSV';
      document.body.appendChild(toast);
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 3000);
    }
  };

  const downloadAllReports = async () => {
    const reportsWithUrls = filteredFileActivities.filter(f => f.file_url && f.action === 'download');

    if (reportsWithUrls.length === 0) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = 'No reports available to download';
      document.body.appendChild(toast);
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 3000);
      return;
    }

    try {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = `Downloading ${reportsWithUrls.length} reports...`;
      document.body.appendChild(toast);

      const fileUrls = reportsWithUrls.map(f => f.file_url);
      await reportStorage.bulkDownloadReports(fileUrls);

      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }

      const successToast = document.createElement('div');
      successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successToast.textContent = `Successfully downloaded ${reportsWithUrls.length} reports`;
      document.body.appendChild(successToast);
      setTimeout(() => {
        if (document.body.contains(successToast)) {
          document.body.removeChild(successToast);
        }
      }, 3000);
    } catch {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = 'Failed to download reports';
      document.body.appendChild(toast);
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor user activities and platform usage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Activities"
            value={summary.totalActivities}
            icon={Activity}
            color="blue"
          />
          <SummaryCard
            title="Analyses"
            value={summary.analyses}
            icon={BarChart3}
            color="purple"
          />
          <SummaryCard
            title="Uploads"
            value={summary.uploads}
            icon={Upload}
            color="green"
          />
          <SummaryCard
            title="Downloads"
            value={summary.downloads}
            icon={Download}
            color="orange"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters & Actions
            </h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </option>
                ))}
              </select>
              <button
                onClick={() => exportToCSV(filteredActivities, 'activities')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <FileText className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => downloadAllReports()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Download All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-lg font-semibold text-gray-900">{users.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Filtered Activities</p>
                <p className="text-lg font-semibold text-gray-900">{filteredActivities.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">File Activities</p>
                <p className="text-lg font-semibold text-gray-900">{filteredFileActivities.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <ActivityTable activities={filteredActivities} />
          <FileActivityTable fileActivities={filteredFileActivities} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
