import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { LANGUAGES } from '../utils/constants';
import Button from './Button';
import Sidebar from './Sidebar';

const KioskLayout = ({ children, showHeader = true, showSidebar = true }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { logout } = useAuth();

  const handleHome = () => {
    navigate('/services');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    // Cycle through languages: EN <-> HI
    if (currentLanguage === LANGUAGES.EN) {
      changeLanguage(LANGUAGES.HI);
    } else {
      changeLanguage(LANGUAGES.EN);
    }
  };

  const getLanguageDisplay = () => {
    switch (currentLanguage) {
      case LANGUAGES.EN:
        return 'English';
      case LANGUAGES.HI:
        return 'हिंदी';
      default:
        return 'English';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Persistent Header */}
      {showHeader && (
        <div className="bg-primary-600 text-white shadow-kiosk-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <span className="text-4xl">🏛️</span>
              <div>
                <h1 className="text-kiosk-xl font-bold">
                  {t('app.title')}
                </h1>
                <p className="text-kiosk-sm opacity-90">
                  {t('app.subtitle')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-kiosk text-kiosk-base font-semibold transition-all touch-feedback"
                aria-label="Change Language"
              >
                🌐 {getLanguageDisplay()}
              </button>

              {/* Home Button */}
              <Button
                variant="secondary"
                size="small"
                onClick={handleHome}
              >
                🏠 {t('common.home')}
              </Button>

              {/* Logout Button */}
              <Button
                variant="secondary"
                size="small"
                onClick={handleLogout}
              >
                🚪 {t('common.logout')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
          {showSidebar && <Sidebar mode="user" />}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-kiosk-sm text-gray-600">
            © 2026 LokSetu - Connecting people and aware everywhere
          </p>
        </div>
      </div>
    </div>
  );
};

export default KioskLayout;
