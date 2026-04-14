import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRequests } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

const AdminTracker = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await getAllRequests();
        setRequests(response.requests || []);
      } catch (error) {
        console.error('Failed to fetch requests for tracker:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const summary = useMemo(() => {
    const total = requests.length;
    const completed = requests.filter((req) => req.status === 'Resolved').length;
    const inProgress = requests.filter((req) => req.status === 'In Progress').length;
    const pending = requests.filter((req) => req.status === 'Submitted').length;
    const rejected = requests.filter((req) => req.status === 'Rejected').length;

    return {
      total,
      completed,
      inProgress,
      pending,
      rejected,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [requests]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-kiosk-xl font-bold text-primary-600">LokSetu Admin Tracker</h1>
            <p className="text-kiosk-sm text-gray-600">Track request completion and progress</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="small" onClick={() => navigate('/admin/requests')}>
              All Requests
            </Button>
            <Button variant="secondary" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-kiosk shadow-kiosk p-6">
          <h2 className="text-kiosk-lg font-semibold text-gray-900 mb-4">Overall Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${summary.completionRate}%` }}
            />
          </div>
          <p className="text-kiosk-base text-gray-700 mt-3">
            {summary.completionRate}% completed ({summary.completed} out of {summary.total})
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-kiosk shadow-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600">Total</p>
            <p className="text-kiosk-xl font-bold text-gray-900">{summary.total}</p>
          </div>
          <div className="bg-white rounded-kiosk shadow-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600">Completed</p>
            <p className="text-kiosk-xl font-bold text-green-600">{summary.completed}</p>
          </div>
          <div className="bg-white rounded-kiosk shadow-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600">In Progress</p>
            <p className="text-kiosk-xl font-bold text-blue-600">{summary.inProgress}</p>
          </div>
          <div className="bg-white rounded-kiosk shadow-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600">Pending</p>
            <p className="text-kiosk-xl font-bold text-amber-600">{summary.pending}</p>
          </div>
          <div className="bg-white rounded-kiosk shadow-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600">Rejected</p>
            <p className="text-kiosk-xl font-bold text-red-600">{summary.rejected}</p>
          </div>
        </div>

        <div className="bg-white rounded-kiosk shadow-kiosk p-6">
          <h2 className="text-kiosk-lg font-semibold text-gray-900 mb-4">Recent Requests</h2>
          {loading ? (
            <div className="text-center py-10">
              <div className="spinner mx-auto" />
            </div>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 8).map((req) => (
                <button
                  key={req.id}
                  onClick={() => navigate(`/admin/requests/${req.id}`)}
                  className="w-full text-left border border-gray-200 rounded-kiosk p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-kiosk-base font-semibold text-gray-900">{req.id}</p>
                      <p className="text-kiosk-sm text-gray-600 capitalize">
                        {req.department} - {req.serviceType?.replace('_', ' ')}
                      </p>
                    </div>
                    <p className="text-kiosk-sm font-semibold text-primary-600">{req.status}</p>
                  </div>
                </button>
              ))}
              {requests.length === 0 && (
                <p className="text-kiosk-base text-gray-600">No requests available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTracker;
