import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRequestById } from '../services/api';
import { DEPARTMENT_INFO } from '../utils/constants';
import Navigation from '../components/Navigation';
import Input from '../components/Input';
import Button from '../components/Button';
import StatusTimeline from '../components/StatusTimeline';
import StatusBadge from '../components/StatusBadge';

const StatusTrackingScreen = () => {
  const { t, i18n } = useTranslation();

  // Helper function to get localized name
  const getLocalizedName = (info) => {
    if (i18n.language === 'hi') return info?.nameHi;
    return info?.name;
  };

  const [requestId, setRequestId] = useState('');
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');
  const [tip, setTip] = useState('Enter your Request ID and click Track.');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!requestId.trim()) {
      setError(t('errors.required'));
      setTip('Request ID is required to track status.');
      return;
    }

    setLoading(true);
    setError('');
    setTip('Fetching latest request data...');

    try {
      const response = await getRequestById(requestId);
      setRequest(response.request);
      setTip('Request found. Review current progress below.');
    } catch (err) {
      setError(t('status.notFound'));
      setTip('No request found with that ID. Please verify and try again.');
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  const deptInfo = request ? DEPARTMENT_INFO[request.department] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation showBack={true} showHome={true} />

      <div className="pt-32 pb-12 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-kiosk-lg shadow-kiosk-lg p-12">
            <h1 className="text-kiosk-2xl font-bold text-gray-900 mb-8 text-center">
              {t('status.title')}
            </h1>

            <div className="space-y-6 mb-8">
              <Input
                label={t('status.requestId')}
                value={requestId}
                onChange={(e) => setRequestId(e.target.value.toUpperCase())}
                placeholder={t('status.enterRequestId')}
                error={error}
              />
              <p className="text-kiosk-sm text-gray-600">{tip}</p>

              <Button
                variant="primary"
                size="large"
                onClick={handleTrack}
                loading={loading}
                fullWidth
              >
                {t('status.track')}
              </Button>
            </div>

            {request && (
              <div className="mt-12 space-y-8">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-kiosk p-4">
                    <p className="text-kiosk-sm text-gray-600">Request ID</p>
                    <p className="text-kiosk-base font-semibold text-gray-900">{request.id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-kiosk p-4">
                    <p className="text-kiosk-sm text-gray-600">Status</p>
                    <p className="text-kiosk-base font-semibold text-gray-900">{request.status}</p>
                  </div>
                  <div className="bg-gray-50 rounded-kiosk p-4">
                    <p className="text-kiosk-sm text-gray-600">Department</p>
                    <p className="text-kiosk-base font-semibold text-gray-900 capitalize">{request.department}</p>
                  </div>
                  <div className="bg-gray-50 rounded-kiosk p-4">
                    <p className="text-kiosk-sm text-gray-600">Service</p>
                    <p className="text-kiosk-base font-semibold text-gray-900 capitalize">
                      {request.serviceType?.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="border-t-4 border-primary-500 pt-8">
                  <h2 className="text-kiosk-xl font-bold text-gray-900 mb-6">
                    {t('status.details')}
                  </h2>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-kiosk-sm text-gray-600 mb-2">
                        {t('status.requestId')}
                      </p>
                      <p className="text-kiosk-lg font-semibold text-gray-900">
                        {request.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-kiosk-sm text-gray-600 mb-2">
                        {t('status.department')}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{deptInfo?.icon}</span>
                        <p className="text-kiosk-lg font-semibold text-gray-900">
                          {getLocalizedName(deptInfo)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-kiosk-sm text-gray-600 mb-2">
                        {t('status.serviceType')}
                      </p>
                      <p className="text-kiosk-lg font-semibold text-gray-900 capitalize">
                        {request.serviceType?.replace('_', ' ')}
                      </p>
                    </div>

                    <div>
                      <p className="text-kiosk-sm text-gray-600 mb-2">
                        {t('confirmation.status')}
                      </p>
                      <StatusBadge status={request.status} />
                    </div>

                    <div>
                      <p className="text-kiosk-sm text-gray-600 mb-2">
                        {t('status.createdAt')}
                      </p>
                      <p className="text-kiosk-base text-gray-900">
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-kiosk-sm text-gray-600 mb-2">
                        {t('status.updatedAt')}
                      </p>
                      <p className="text-kiosk-base text-gray-900">
                        {new Date(request.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {request.description && (
                    <div className="mt-6">
                      <p className="text-kiosk-sm text-gray-600 mb-2">
                        Description
                      </p>
                      <p className="text-kiosk-base text-gray-900 bg-gray-50 p-4 rounded-kiosk">
                        {request.description}
                      </p>
                    </div>
                  )}
                </div>

                <StatusTimeline currentStatus={request.status} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusTrackingScreen;
