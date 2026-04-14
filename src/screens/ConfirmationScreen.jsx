import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { DEPARTMENT_INFO } from '../utils/constants';
import { generateReceipt } from '../utils/pdfGenerator';
import Navigation from '../components/Navigation';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

const ConfirmationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  // Helper function to get localized name
  const getLocalizedName = (info) => {
    if (i18n.language === 'hi') return info?.nameHi;
    return info?.name;
  };

  const request = location.state?.request;

  if (!request) {
    navigate('/');
    return null;
  }

  const deptInfo = DEPARTMENT_INFO[request.department];

  const handleDownloadReceipt = () => {
    generateReceipt(request);
  };

  const handleNewRequest = () => {
    navigate('/services');
  };

  const handleTrackStatus = () => {
    navigate('/track-status');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation showBack={false} showHome={true} />

      <div className="pt-32 pb-12 px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-kiosk-lg shadow-kiosk-xl p-12">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
                <span className="text-6xl">✓</span>
              </div>
              <h1 className="text-kiosk-2xl font-bold text-gray-900 mb-3">
                {t('confirmation.title')}
              </h1>
              <p className="text-kiosk-lg text-gray-600">
                {t('confirmation.success')}
              </p>
            </div>

            {/* Request Details */}
            <div className="bg-gray-50 rounded-kiosk-lg p-8 mb-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-kiosk-sm text-gray-600 mb-2">
                    {t('confirmation.requestId')}
                  </p>
                  <p className="text-kiosk-xl font-bold text-primary-600">
                    {request.id}
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
                    {t('confirmation.department')}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{deptInfo?.icon}</span>
                    <p className="text-kiosk-base font-semibold text-gray-900">
                      {getLocalizedName(deptInfo)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-kiosk-sm text-gray-600 mb-2">
                    {t('confirmation.dateTime')}
                  </p>
                  <p className="text-kiosk-base text-gray-900">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center pt-4">
                <div className="bg-white p-4 rounded-kiosk shadow-kiosk">
                  <QRCodeSVG value={request.id} size={120} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                variant="primary"
                size="large"
                icon="📥"
                onClick={handleDownloadReceipt}
                fullWidth
              >
                {t('confirmation.downloadReceipt')}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="medium"
                  onClick={handleTrackStatus}
                  fullWidth
                >
                  {t('confirmation.trackStatus')}
                </Button>
                <Button
                  variant="outline"
                  size="medium"
                  onClick={handleNewRequest}
                  fullWidth
                >
                  {t('confirmation.newRequest')}
                </Button>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="mt-8 text-center">
              <p className="text-kiosk-base text-gray-600">
                {t('confirmation.thankYou')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
