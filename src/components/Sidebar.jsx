import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllRequests, getUserRequests } from '../services/api';
import Button from './Button';

const StatusStat = ({ label, value, className = '' }) => (
  <div className={`bg-gray-50 rounded-kiosk p-4 ${className}`}>
    <p className="text-kiosk-sm text-gray-600">{label}</p>
    <p className="text-kiosk-xl font-bold text-gray-900">{value}</p>
  </div>
);

const Sidebar = ({ mode }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (mode === 'admin') {
          const res = await getAllRequests();
          setRequests(res.requests || []);
        } else {
          const res = await getUserRequests(user?.id);
          setRequests(res.requests || []);
        }
      } catch (e) {
        console.error('Sidebar: failed to load requests', e);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    if (mode === 'admin' || user?.id) fetchData();
  }, [mode, user?.id]);

  const summary = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === 'Submitted').length;
    const inProgress = requests.filter((r) => r.status === 'In Progress').length;
    const resolved = requests.filter((r) => r.status === 'Resolved').length;
    const rejected = requests.filter((r) => r.status === 'Rejected').length;
    const completionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return { total, pending, inProgress, resolved, rejected, completionRate };
  }, [requests]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const email = user?.email || user?.username || '—';

  const navItems =
    mode === 'admin'
      ? [
          { label: 'Dashboard', to: '/admin/dashboard' },
          { label: 'All Requests', to: '/admin/requests' },
          { label: 'Status Tracker', to: '/admin/tracker' },
        ]
      : [
          { label: 'User Dashboard', to: '/services' },
          { label: 'Track Status', to: '/track-status' },
        ];

  return (
    <aside className="w-full lg:w-[320px] shrink-0">
      <div className="sticky top-6">
        <div className="bg-white rounded-kiosk-lg shadow-kiosk p-6 space-y-6">
          <div>
            <p className="text-kiosk-sm text-gray-600">
              {mode === 'admin' ? 'Admin' : 'User'}
            </p>
            <p className="text-kiosk-base font-semibold text-gray-900 break-all">
              {email}
            </p>
          </div>

          <div className="space-y-3">
            {navItems.map((item) => (
              <Button
                key={item.to}
                variant="outline"
                size="medium"
                onClick={() => navigate(item.to)}
                fullWidth
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div>
            <h3 className="text-kiosk-base font-semibold text-gray-900 mb-3">
              Track Process
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${summary.completionRate}%` }}
              />
            </div>
            <p className="text-kiosk-sm text-gray-600 mt-2">
              {loading ? 'Loading…' : `${summary.completionRate}% completed`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatusStat label="Total" value={summary.total} />
            <StatusStat label="Pending" value={summary.pending} />
            <StatusStat label="In Progress" value={summary.inProgress} />
            <StatusStat label="Resolved" value={summary.resolved} />
          </div>

          <StatusStat
            label="Rejected"
            value={summary.rejected}
            className="border border-gray-200"
          />

          <Button variant="secondary" size="medium" onClick={handleLogout} fullWidth>
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

