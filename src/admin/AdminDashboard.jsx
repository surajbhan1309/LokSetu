import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRequests } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const response = await getAllRequests();
        setRequests(response.requests || []);
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const complaints = useMemo(() => {
    return requests.filter((r) => r.serviceType === 'complaint');
  }, [requests]);

  const summary = useMemo(() => {
    const total = complaints.length;
    const submitted = complaints.filter((r) => r.status === 'Submitted').length;
    const inProgress = complaints.filter((r) => r.status === 'In Progress').length;
    const resolved = complaints.filter((r) => r.status === 'Resolved').length;
    const rejected = complaints.filter((r) => r.status === 'Rejected').length;
    return { total, submitted, inProgress, resolved, rejected };
  }, [complaints]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-kiosk-xl font-bold text-primary-600">LokSetu Admin Dashboard</h1>
            <p className="text-kiosk-sm text-gray-600">
              Complaints registered
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="small" onClick={() => navigate('/admin/requests')}>
              All Requests
            </Button>
            <Button variant="outline" size="small" onClick={() => navigate('/admin/tracker')}>
              Status Tracker
            </Button>
            <Button variant="secondary" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-kiosk shadow-kiosk p-6">
          <h2 className="text-kiosk-lg font-semibold text-gray-900">Complaints Overview</h2>
          <p className="text-kiosk-sm text-gray-600">
            Track complaint completion and progress.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-kiosk shadow-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600">Total</p>
            <p className="text-kiosk-xl font-bold text-gray-900">{summary.total}</p>
          </div>
          <div className="bg-white rounded-kiosk shadow-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600">Pending</p>
            <p className="text-kiosk-xl font-bold text-amber-600">{summary.submitted}</p>
          </div>
          <div className="bg-white rounded-kiosk shadow-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600">In Progress</p>
            <p className="text-kiosk-xl font-bold text-blue-600">{summary.inProgress}</p>
          </div>
          <div className="bg-white rounded-kiosk shadow-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600">Resolved</p>
            <p className="text-kiosk-xl font-bold text-green-600">{summary.resolved}</p>
          </div>
          <div className="bg-white rounded-kiosk shadow-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600">Rejected</p>
            <p className="text-kiosk-xl font-bold text-red-600">{summary.rejected}</p>
          </div>
        </div>

        <div className="bg-white rounded-kiosk shadow-kiosk overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-kiosk-lg font-semibold text-gray-900">
              Complaints ({complaints.length})
            </h2>
            <Button variant="outline" size="small" onClick={() => navigate('/admin/requests')}>
              Open Requests Page
            </Button>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="spinner mx-auto"></div>
              <p className="text-kiosk-base text-gray-600 mt-4">Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-kiosk-lg text-gray-500">No complaints found</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-kiosk-sm font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-4 text-left text-kiosk-sm font-semibold text-gray-700">Department</th>
                    <th className="px-6 py-4 text-left text-kiosk-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-kiosk-sm font-semibold text-gray-700">Created</th>
                    <th className="px-6 py-4 text-left text-kiosk-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {complaints.slice(0, 50).map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-kiosk-base font-semibold text-primary-600">{r.id}</td>
                      <td className="px-6 py-4 text-kiosk-base text-gray-900 capitalize">{r.department}</td>
                      <td className="px-6 py-4 text-kiosk-base text-gray-900">{r.status}</td>
                      <td className="px-6 py-4 text-kiosk-sm text-gray-600">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => navigate(`/admin/requests/${r.id}`)}
                        >
                          View / Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

