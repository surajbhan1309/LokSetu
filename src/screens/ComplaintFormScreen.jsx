import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { createRequest } from '../services/api';
import { validateRequired, validateLength, validateFile } from '../utils/validation';
import { DEPARTMENT_INFO } from '../utils/constants';
import Navigation from '../components/Navigation';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Button from '../components/Button';

const ComplaintFormScreen = () => {
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
    issueType: '',
    description: '',
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const issueTypeOptions = [
    { value: 'powerOutage', label: t('complaint.issueTypes.powerOutage') },
    { value: 'billing', label: t('complaint.issueTypes.billing') },
    { value: 'meterFault', label: t('complaint.issueTypes.meterFault') },
    { value: 'leakage', label: t('complaint.issueTypes.leakage') },
    { value: 'quality', label: t('complaint.issueTypes.quality') },
    { value: 'connection', label: t('complaint.issueTypes.connection') },
    { value: 'disconnection', label: t('complaint.issueTypes.disconnection') },
    { value: 'other', label: t('complaint.issueTypes.other') },
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
    // Validate form
    const newErrors = {};
    
    const issueTypeValidation = validateRequired(formData.issueType, 'Issue type');
    if (!issueTypeValidation.valid) {
      newErrors.issueType = issueTypeValidation.error;
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
        serviceType: 'complaint',
        issueType: formData.issueType,
        description: formData.description,
        hasAttachment: !!formData.file,
      };
      
      const response = await createRequest(requestData);
      navigate('/confirmation', { state: { request: response.request } });
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
                  {t('complaint.title')}
                </h1>
                <p className="text-kiosk-base text-gray-600">
                  {getLocalizedName(deptInfo)}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <Select
                label={t('complaint.issueType')}
                value={formData.issueType}
                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                options={issueTypeOptions}
                placeholder={t('complaint.selectIssue')}
                error={errors.issueType}
                required
              />

              <Textarea
                label={t('complaint.description')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('complaint.descriptionPlaceholder')}
                error={errors.description}
                required
                rows={6}
                maxLength={500}
              />

              <div>
                <label className="block text-kiosk-base font-semibold text-gray-700 mb-3">
                  {t('complaint.uploadDocument')}
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="w-full min-h-touch-lg px-6 py-4 text-kiosk-base bg-white border-2 border-gray-300 rounded-kiosk focus:border-primary-500 focus:outline-none"
                />
                <p className="mt-2 text-kiosk-sm text-gray-500">
                  {t('complaint.uploadHint')}
                </p>
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
                  {t('complaint.submit')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintFormScreen;
