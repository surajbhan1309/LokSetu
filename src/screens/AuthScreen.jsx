import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { loginCitizen, signupCitizen } from '../services/api';
import { validateEmail, validatePassword } from '../utils/validation';
import Navigation from '../components/Navigation';
import Input from '../components/Input';
import Button from '../components/Button';

const AuthScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErrors({});
    setPassword('');
    setConfirmPassword('');
    setEmail('');
  }, [authMode]);

  const validateForm = () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { email: emailValidation.error };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { password: passwordValidation.error };
    }

    if (authMode === 'signup' && password !== confirmPassword) {
      return { confirmPassword: t('auth.passwordMismatch') };
    }

    return null;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (formErrors) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = authMode === 'login'
        ? await loginCitizen(email.trim().toLowerCase(), password, 'citizen')
        : await signupCitizen(email.trim().toLowerCase(), password, 'citizen');

      login(response.user);
      navigate('/services');
    } catch (error) {
      setErrors({ general: error.message || t('errors.generic') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation showBack={true} showHome={true} />

      <div className="pt-32 pb-12 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-kiosk-lg shadow-kiosk-lg p-12">
            <h1 className="text-kiosk-2xl font-bold text-gray-900 mb-8 text-center">
              {t('auth.title')}
            </h1>

            <div className="mb-8 grid grid-cols-2 gap-3">
              <Button
                variant={authMode === 'login' ? 'primary' : 'secondary'}
                size="large"
                onClick={() => setAuthMode('login')}
                disabled={loading}
                fullWidth
              >
                {t('auth.login')}
              </Button>
              <Button
                variant={authMode === 'signup' ? 'primary' : 'secondary'}
                size="large"
                onClick={() => setAuthMode('signup')}
                disabled={loading}
                fullWidth
              >
                {t('auth.signup')}
              </Button>
            </div>

            <div className="space-y-8">
              <Input
                label={t('auth.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.enterEmail')}
                error={errors.email}
                required
              />

              <Input
                label={t('auth.password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.enterPassword')}
                error={errors.password}
                required
              />

              {authMode === 'signup' && (
                <Input
                  label={t('auth.confirmPassword')}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.enterConfirmPassword')}
                  error={errors.confirmPassword}
                  required
                />
              )}

              <Button
                variant="primary"
                size="large"
                onClick={handleSubmit}
                loading={loading}
                fullWidth
              >
                {authMode === 'login' ? t('auth.login') : t('auth.signup')}
              </Button>
            </div>

            {errors.general && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-kiosk">
                <p className="text-kiosk-base text-red-600 text-center">
                  {errors.general}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
