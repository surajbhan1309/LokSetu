import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEPARTMENTS, DEPARTMENT_INFO } from '../utils/constants';
import DepartmentCard from '../components/DepartmentCard';

const ServiceSelectionScreen = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  // Helper function to get localized name
  const getLocalizedName = (info) => {
    if (i18n.language === 'hi') return info.nameHi;
    return info.name;
  };

  const handleDepartmentSelect = (department) => {
    navigate(`/service-type/${department}`);
  };

  return (
    <div>
      <h1 className="text-kiosk-2xl font-bold text-gray-900 mb-12 text-center">
        {t('departments.title')}
      </h1>

      <div className="grid grid-cols-2 gap-8">
        {Object.values(DEPARTMENTS).map((dept) => {
          const info = DEPARTMENT_INFO[dept];
          return (
            <DepartmentCard
              key={dept}
              department={dept}
              icon={info.icon}
              name={getLocalizedName(info)}
              color={info.color}
              onClick={handleDepartmentSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelectionScreen;
