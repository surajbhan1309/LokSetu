import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/Navigation';
import Button from '../components/Button';

const RoleSelectionScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation showBack={true} showHome={true} />

      <div className="pt-32 pb-12 px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-kiosk-lg shadow-kiosk-lg p-12 text-center">
            <h1 className="text-kiosk-2xl font-bold text-gray-900 mb-4">
              Continue As
            </h1>
            <p className="text-kiosk-base text-gray-600 mb-10">
              After selecting your language, choose your portal and continue with login or sign up.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                variant="primary"
                size="large"
                onClick={() => navigate('/auth')}
                fullWidth
              >
                {t('auth.login')} / {t('auth.signup')} as User
              </Button>
              <Button
                variant="secondary"
                size="large"
                onClick={() => navigate('/admin/login')}
                fullWidth
              >
                {t('auth.login')} / {t('auth.signup')} as Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
