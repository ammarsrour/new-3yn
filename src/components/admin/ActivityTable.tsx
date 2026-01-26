import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Activity } from 'lucide-react';

interface ActivityTableProps {
  activities: any[];
}

const ActivityTable: React.FC<ActivityTableProps> = ({ activities }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getActivityBadgeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      page_view: 'bg-gray-100 text-gray-800',
      upload: 'bg-green-100 text-green-800',
      analysis: 'bg-purple-100 text-purple-800',
      download: 'bg-blue-100 text-blue-800',
      login: 'bg-emerald-100 text-emerald-800',
      logout: 'bg-orange-100 text-orange-800',
      location_select: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          User Activities
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No activities found
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <React.Fragment key={activity.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.user_profiles?.full_name || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.user_profiles?.email || 'N/A'}
                      </div>
                      {activity.user_profiles?.company_name && (
                        <div className="text-xs text-gray-400">
                          {activity.user_profiles.company_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActivityBadgeColor(activity.activity_type)}`}>
                        {activity.activity_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {activity.activity_description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(activity.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleRow(activity.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {expandedRows.has(activity.id) ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Show
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(activity.id) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2">
                          <div>
                            <span className="font-semibold text-gray-700">Metadata:</span>
                            <pre className="mt-2 p-3 bg-white rounded border border-gray-200 text-xs overflow-x-auto">
                              {JSON.stringify(activity.metadata, null, 2)}
                            </pre>
                          </div>
                          {activity.user_agent && (
                            <div>
                              <span className="font-semibold text-gray-700">User Agent:</span>
                              <p className="text-sm text-gray-600 mt-1">{activity.user_agent}</p>
                            </div>
                          )}
                          {activity.ip_address && (
                            <div>
                              <span className="font-semibold text-gray-700">IP Address:</span>
                              <p className="text-sm text-gray-600 mt-1">{activity.ip_address}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
