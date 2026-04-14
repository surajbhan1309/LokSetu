import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRequests } from '../services/api';
import { DEPARTMENTS, DEPARTMENT_INFO, REQUEST_STATUS, STATUS_INFO } from '../utils/constants';
import Button from '../components/Button';
import Select from '../components/Select';
import StatusBadge from '../components/StatusBadge';
import Input from '../components/Input';

const RequestsList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    query: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await getAllRequests();
        setRequests(response.requests || []);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = [...requests];

    if (filters.department) {
      filtered = filtered.filter((req) => req.department === filters.department);
    }
    if (filters.status) {
      filtered = filtered.filter((req) => req.status === filters.status);
    }
    if (filters.query.trim()) {
      const query = filters.query.trim().toLowerCase();
      filtered = filtered.filter((req) => {
        const id = req.id?.toLowerCase() || '';
        const department = req.department?.toLowerCase() || '';
        const type = req.serviceType?.toLowerCase() || '';
        const status = req.status?.toLowerCase() || '';
        return (
          id.includes(query) ||
          department.includes(query) ||
          type.includes(query) ||
          status.includes(query)
        );
      });
    }

    setFilteredRequests(filtered);
  }, [requests, filters]);

  const summary = {
    total: filteredRequests.length,
    pending: filteredRequests.filter((r) => r.status === REQUEST_STATUS.SUBMITTED).length,
    inProgress: filteredRequests.filter((r) => r.status === REQUEST_STATUS.IN_PROGRESS).length,
    resolved: filteredRequests.filter((r) => r.status === REQUEST_STATUS.RESOLVED).length,
    rejected: filteredRequests.filter((r) => r.status === REQUEST_STATUS.REJECTED).length,
  };

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...Object.values(DEPARTMENTS).map((dept) => ({
      value: dept,
      label: DEPARTMENT_INFO[dept].name,
    })),
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.values(REQUEST_STATUS).map((status) => ({
      value: status,
      label: STATUS_INFO[status].name,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-kiosk shadow-kiosk p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-kiosk-xl font-bold text-primary-600">All Requests</h1>
          <Button variant="outline" size="small" onClick={() => navigate('/admin/tracker')}>
            Open Tracker
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-6">
          <div className="bg-gray-50 rounded-kiosk p-3">
            <p className="text-kiosk-sm text-gray-600">Total</p>
            <p className="text-kiosk-lg font-bold text-gray-900">{summary.total}</p>
          </div>
          <div className="bg-gray-50 rounded-kiosk p-3">
            <p className="text-kiosk-sm text-gray-600">Pending</p>
            <p className="text-kiosk-lg font-bold text-amber-600">{summary.pending}</p>
          </div>
          <div className="bg-gray-50 rounded-kiosk p-3">
            <p className="text-kiosk-sm text-gray-600">In Progress</p>
            <p className="text-kiosk-lg font-bold text-blue-600">{summary.inProgress}</p>
          </div>
          <div className="bg-gray-50 rounded-kiosk p-3">
            <p className="text-kiosk-sm text-gray-600">Resolved</p>
            <p className="text-kiosk-lg font-bold text-green-600">{summary.resolved}</p>
          </div>
          <div className="bg-gray-50 rounded-kiosk p-3">
            <p className="text-kiosk-sm text-gray-600">Rejected</p>
            <p className="text-kiosk-lg font-bold text-red-600">{summary.rejected}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Input
            label="Search"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder="Search by ID, department, type, status"
          />
          <Select
            label="Department"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            options={departmentOptions}
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={statusOptions}
          />
        </div>
      </div>

      <div className="bg-white rounded-kiosk shadow-kiosk overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-kiosk-lg font-semibold text-gray-900">
            Requests ({filteredRequests.length})
          </h2>
          <div className="flex gap-2">
            <Button
              variant={filters.status === REQUEST_STATUS.SUBMITTED ? 'primary' : 'outline'}
              size="small"
              onClick={() =>
                setFilters({
                  ...filters,
                  status:
                    filters.status === REQUEST_STATUS.SUBMITTED ? '' : REQUEST_STATUS.SUBMITTED,
                })
              }
            >
              Pending
            </Button>
            <Button
              variant={filters.status === REQUEST_STATUS.IN_PROGRESS ? 'primary' : 'outline'}
              size="small"
              onClick={() =>
                setFilters({
                  ...filters,
                  status:
                    filters.status === REQUEST_STATUS.IN_PROGRESS ? '' : REQUEST_STATUS.IN_PROGRESS,
                })
              }
            >
              In Progress
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="spinner mx-auto"></div>
            <p className="text-kiosk-base text-gray-600 mt-4">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-kiosk-lg text-gray-500">No requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-kiosk-sm font-semibold text-gray-700">
                    Request ID
                  </th>
                  <th className="px-6 py-4 text-left text-kiosk-sm font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-kiosk-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-kiosk-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-kiosk-sm font-semibold text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-kiosk-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => {
                  const deptInfo = DEPARTMENT_INFO[request.department];
                  return (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-kiosk-base font-semibold text-primary-600">
                        {request.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{deptInfo?.icon}</span>
                          <span className="text-kiosk-base text-gray-900">{deptInfo?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-kiosk-base text-gray-900 capitalize">
                        {request.serviceType?.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4 text-kiosk-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => navigate(`/admin/requests/${request.id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsList;
