import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { createRequest } from '../services/api';
import { SERVICE_TYPES, SERVICE_TYPE_INFO, DEPARTMENT_INFO } from '../utils/constants';
import Navigation from '../components/Navigation';
import ServiceCard from '../components/ServiceCard';

const ServiceTypeScreen = () => {
  const navigate = useNavigate();
  const { department } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Helper function to get localized name
  const getLocalizedName = (info) => {
    if (i18n.language === 'hi') return info.nameHi;
    return info.name;
  };

  const handleServiceSelect = async (serviceType) => {
    if (serviceType === SERVICE_TYPES.PAY_BILL) {
      setLoading(true);
      try {
        // Create a bill payment request first
        const response = await createRequest({
          userId: user.id,
          department,
          serviceType: 'pay_bill',
          description: `${DEPARTMENT_INFO[department]?.name} Bill Payment`,
          requiresPayment: true,
        });
        
        // Navigate to payment with the real request ID
        navigate('/payment', { 
          state: { 
            amount: 1500, // Example bill amount
            requestId: response.request.id,
            purpose: `${DEPARTMENT_INFO[department]?.name} Bill Payment`,
            department: department
          } 
        });
      } catch (error) {
        console.error('Failed to create bill payment request:', error);
        alert('Failed to initiate payment. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (serviceType === SERVICE_TYPES.REGISTER_COMPLAINT) {
      navigate(`/complaint/${department}`);
    } else if (serviceType === SERVICE_TYPES.SERVICE_REQUEST) {
      navigate(`/service-request/${department}`);
    } else if (serviceType === SERVICE_TYPES.TRACK_STATUS) {
      navigate('/track-status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation showBack={true} showHome={true} />

      <div className="pt-32 pb-12 px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-kiosk-2xl font-bold text-gray-900 mb-12 text-center">
            {t('serviceTypes.title')}
          </h1>

          <div className="grid grid-cols-2 gap-8">
            {Object.values(SERVICE_TYPES).map((serviceType) => {
              const info = SERVICE_TYPE_INFO[serviceType];
              return (
                <ServiceCard
                  key={serviceType}
                  icon={info.icon}
                  name={getLocalizedName(info)}
                  onClick={() => handleServiceSelect(serviceType)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTypeScreen;
