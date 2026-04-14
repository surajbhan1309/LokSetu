import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { createRequest } from '../services/api';
import { validateRequired, validateLength, validateFile } from '../utils/validation';
import { DEPARTMENT_INFO } from '../utils/constants';
import Navigation from '../components/Navigation';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Button from '../components/Button';

const ServiceRequestScreen = () => {
  const navigate = useNavigate();
  const { department } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isHindi = i18n.language === 'hi';

  // Helper function to get localized name
  const getLocalizedName = (info) => {
    if (i18n.language === 'hi') return info?.nameHi;
    return info?.name;
  };

  const [formData, setFormData] = useState({
    requestType: '',
    description: '',
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const requestTypeOptions = [
    { value: 'newConnection', label: t('serviceRequest.requestTypes.newConnection') },
    { value: 'disconnection', label: t('serviceRequest.requestTypes.disconnection') },
    { value: 'reconnection', label: t('serviceRequest.requestTypes.reconnection') },
    { value: 'meterChange', label: t('serviceRequest.requestTypes.meterChange') },
    { value: 'nameChange', label: t('serviceRequest.requestTypes.nameChange') },
    { value: 'addressChange', label: t('serviceRequest.requestTypes.addressChange') },
    { value: 'other', label: t('serviceRequest.requestTypes.other') },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setErrors({ ...errors, file: validation.error });
      return;
    }
    
    setFormData({ ...formData, file });
    setErrors({ ...errors, file: null });
  };

  const handleSubmit = async () => {
    const newErrors = {};
    
    const requestTypeValidation = validateRequired(formData.requestType, 'Request type');
    if (!requestTypeValidation.valid) {
      newErrors.requestType = requestTypeValidation.error;
    }
    
    const descriptionValidation = validateLength(formData.description, 10, 500, 'Description');
    if (!descriptionValidation.valid) {
      newErrors.description = descriptionValidation.error;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const requestData = {
        userId: user.id,
        department,
        serviceType: 'service_request',
        requestType: formData.requestType,
        description: formData.description,
        hasAttachment: !!formData.file,
        requiresPayment: formData.requestType === 'newConnection',
      };
      
      const response = await createRequest(requestData);
      
      // If new connection, redirect to payment
      if (formData.requestType === 'newConnection') {
        navigate('/payment', { 
          state: { 
            amount: 2500, // New connection fee
            requestId: response.request.id,
            purpose: 'New Connection Booking',
            department: department
          } 
        });
      } else {
        navigate('/confirmation', { state: { request: response.request } });
      }
    } catch (error) {
      setErrors({ general: error.message || t('errors.generic') });
    } finally {
      setLoading(false);
    }
  };

  const deptInfo = DEPARTMENT_INFO[department];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation showBack={true} showHome={true} />

      <div className="pt-32 pb-12 px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-kiosk-lg shadow-kiosk-lg p-12">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-5xl">{deptInfo?.icon}</span>
              <div>
                <h1 className="text-kiosk-2xl font-bold text-gray-900">
                  {t('serviceRequest.title')}
                </h1>
                <p className="text-kiosk-base text-gray-600">
                  {getLocalizedName(deptInfo)}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <Select
                label={t('serviceRequest.requestType')}
                value={formData.requestType}
                onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                options={requestTypeOptions}
                placeholder={t('serviceRequest.selectRequest')}
                error={errors.requestType}
                required
              />

              <Textarea
                label={t('serviceRequest.description')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('serviceRequest.descriptionPlaceholder')}
                error={errors.description}
                required
                rows={6}
                maxLength={500}
              />

              <div>
                <label className="block text-kiosk-base font-semibold text-gray-700 mb-3">
                  {t('serviceRequest.uploadDocument')}
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="w-full min-h-touch-lg px-6 py-4 text-kiosk-base bg-white border-2 border-gray-300 rounded-kiosk focus:border-primary-500 focus:outline-none"
                />
                {errors.file && (
                  <p className="mt-2 text-kiosk-sm text-red-600 font-medium">
                    {errors.file}
                  </p>
                )}
              </div>

              {errors.general && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-kiosk">
                  <p className="text-kiosk-base text-red-600 text-center">
                    {errors.general}
                  </p>
                </div>
              )}

              <div className="flex gap-6 pt-4">
                <Button
                  variant="secondary"
                  size="large"
                  onClick={() => navigate(-1)}
                  fullWidth
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleSubmit}
                  loading={loading}
                  fullWidth
                >
                  {t('serviceRequest.submit')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestScreen;
