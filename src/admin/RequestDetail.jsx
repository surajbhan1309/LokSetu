import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequestById, updateRequestStatus } from '../services/api';
import { DEPARTMENT_INFO, REQUEST_STATUS, STATUS_INFO } from '../utils/constants';
import Button from '../components/Button';
import Select from '../components/Select';
import StatusTimeline from '../components/StatusTimeline';
import StatusBadge from '../components/StatusBadge';

const RequestDetail = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();

  const [request, setRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const response = await getRequestById(requestId);
      setRequest(response.request);
      setNewStatus(response.request.status);
    } catch (err) {
      setError('Request not found');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (newStatus === request.status) {
      return;
    }

    setUpdating(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await updateRequestStatus(requestId, newStatus);
      setRequest(response.request);
      setSuccessMessage('Status updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[360px] flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="min-h-[360px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-kiosk-xl text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/admin/requests')}>
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  const deptInfo = DEPARTMENT_INFO[request.department];

  const statusOptions = Object.values(REQUEST_STATUS).map((status) => ({
    value: status,
    label: STATUS_INFO[status].name,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-kiosk shadow-kiosk p-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="small"
          onClick={() => navigate('/admin/requests')}
        >
          ← Back to Requests
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="small" onClick={() => navigate('/admin/tracker')}>
            Tracker
          </Button>
          <Button variant="outline" size="small" onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </Button>
        </div>
      </div>

      {/* Request Details Card */}
      <div className="bg-white rounded-kiosk shadow-kiosk-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{deptInfo?.icon}</span>
            <div>
              <h1 className="text-kiosk-2xl font-bold text-gray-900">
                Request Details
              </h1>
              <p className="text-kiosk-base text-gray-600">
                {request.id}
              </p>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 rounded-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600 mb-2">Department</p>
            <p className="text-kiosk-base font-semibold text-gray-900">
              {deptInfo?.name}
            </p>
          </div>
          <div className="bg-gray-50 rounded-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600 mb-2">Current Status</p>
            <p className="text-kiosk-base font-semibold text-gray-900">
              {request.status}
            </p>
          </div>
          <div className="bg-gray-50 rounded-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600 mb-2">Created</p>
            <p className="text-kiosk-base text-gray-900">
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-kiosk p-4">
            <p className="text-kiosk-sm text-gray-600 mb-2">Updated</p>
            <p className="text-kiosk-base text-gray-900">
              {new Date(request.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-kiosk-sm text-gray-600 mb-2">Department</p>
              <p className="text-kiosk-lg font-semibold text-gray-900">
                {deptInfo?.name}
              </p>
            </div>

            <div>
              <p className="text-kiosk-sm text-gray-600 mb-2">Service Type</p>
              <p className="text-kiosk-lg font-semibold text-gray-900 capitalize">
                {request.serviceType?.replace('_', ' ')}
              </p>
            </div>

            <div>
              <p className="text-kiosk-sm text-gray-600 mb-2">User ID</p>
              <p className="text-kiosk-base text-gray-900">{request.userId}</p>
            </div>

            <div>
              <p className="text-kiosk-sm text-gray-600 mb-2">Created At</p>
              <p className="text-kiosk-base text-gray-900">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-kiosk-sm text-gray-600 mb-2">Updated At</p>
              <p className="text-kiosk-base text-gray-900">
                {new Date(request.updatedAt).toLocaleString()}
              </p>
            </div>

            {request.issueType && (
              <div>
                <p className="text-kiosk-sm text-gray-600 mb-2">Issue Type</p>
                <p className="text-kiosk-base text-gray-900 capitalize">
                  {request.issueType}
                </p>
              </div>
            )}

            {request.requestType && (
              <div>
                <p className="text-kiosk-sm text-gray-600 mb-2">Request Type</p>
                <p className="text-kiosk-base text-gray-900 capitalize">
                  {request.requestType}
                </p>
              </div>
            )}
        </div>

        {request.description && (
          <div className="mb-8">
            <p className="text-kiosk-sm text-gray-600 mb-2">Description</p>
            <div className="bg-gray-50 p-4 rounded-kiosk">
              <p className="text-kiosk-base text-gray-900">
                {request.description}
              </p>
            </div>
          </div>
        )}

        {request.hasAttachment && (
          <div className="mb-8">
            <p className="text-kiosk-sm text-gray-600 mb-2">Attachment</p>
            <div className="flex items-center gap-2 text-primary-500">
              <span>📎</span>
              <span className="text-kiosk-base">Document attached</span>
            </div>
          </div>
        )}

        <StatusTimeline currentStatus={request.status} />
      </div>

      {/* Update Status Card */}
      <div className="bg-white rounded-kiosk shadow-kiosk p-8">
        <h2 className="text-kiosk-xl font-bold text-gray-900 mb-6">
          Update Status
        </h2>

        <div className="space-y-6">
          <Select
            label="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={statusOptions}
          />

          {successMessage && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-kiosk">
              <p className="text-kiosk-base text-green-600 text-center">
                {successMessage}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-kiosk">
              <p className="text-kiosk-base text-red-600 text-center">
                {error}
              </p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-3">
            {[REQUEST_STATUS.SUBMITTED, REQUEST_STATUS.IN_PROGRESS, REQUEST_STATUS.RESOLVED, REQUEST_STATUS.REJECTED].map((status) => (
              <Button
                key={status}
                variant={newStatus === status ? 'primary' : 'outline'}
                size="small"
                onClick={() => setNewStatus(status)}
              >
                {STATUS_INFO[status].name}
              </Button>
            ))}
          </div>

          <Button
            variant="primary"
            size="large"
            onClick={handleUpdateStatus}
            loading={updating}
            disabled={newStatus === request.status}
            fullWidth
          >
            Update Status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
