import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../utils/constants';
import Button from '../components/Button';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(null);

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
    setSelectedLang(lang);
  };

  const handleStart = () => {
    navigate('/choose-role');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Logo and Title */}
        <div className="space-y-4 animate-fade-in">
          <div className="text-8xl mb-6">🏛️</div>
          <h1 className="text-kiosk-3xl font-bold text-primary-600">
            {t('app.title')}
          </h1>
          <p className="text-kiosk-xl text-gray-700 font-medium">
            {t('app.subtitle')}
          </p>
          <p className="text-kiosk-base text-gray-600">
            {t('app.tagline')}
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-6">
          <h2 className="text-kiosk-xl font-semibold text-gray-800">
            {t('language.select')}
          </h2>
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Button
              variant={selectedLang === LANGUAGES.EN ? "primary" : "outline"}
              size="large"
              onClick={() => handleLanguageSelect(LANGUAGES.EN)}
              fullWidth
            >
              <span className="text-kiosk-lg">English</span>
            </Button>
            <Button
              variant={selectedLang === LANGUAGES.HI ? "primary" : "outline"}
              size="large"
              onClick={() => handleLanguageSelect(LANGUAGES.HI)}
              fullWidth
            >
              <span className="text-kiosk-lg">हिंदी</span>
            </Button>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-8 flex flex-col items-center gap-4">
          <Button
            variant="primary"
            size="large"
            onClick={handleStart}
            disabled={!selectedLang}
            className="px-20"
          >
            {t('common.start')} →
          </Button>
          {!selectedLang && (
            <p className="text-kiosk-sm text-gray-500">
              Please select a language to continue
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-12 text-kiosk-sm text-gray-500">
          <p>Press Start to begin your civic service journey</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
