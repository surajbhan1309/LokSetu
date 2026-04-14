import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Navigation = ({ showBack = true, showHome = true, onBack, onHome }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (isAuthenticated) {
      navigate('/services');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              variant="outline"
              size="medium"
              icon="←"
              onClick={handleBack}
            >
              {t('common.back')}
            </Button>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-kiosk-xl font-bold text-primary-600">
            {t('app.title')}
          </h1>
          <p className="text-kiosk-sm text-gray-600">
            {t('app.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {showHome && (
            <Button
              variant="secondary"
              size="medium"
              icon="🏠"
              onClick={handleHome}
            >
              {t('common.home')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
