import React from 'react';
import { REQUEST_STATUS, STATUS_INFO } from '../utils/constants';
import { useTranslation } from 'react-i18next';

const StatusBadge = ({ status }) => {
  const { i18n } = useTranslation();
  const statusInfo = STATUS_INFO[status] || STATUS_INFO[REQUEST_STATUS.SUBMITTED];
  const getLocalizedName = () => {
    if (i18n.language === 'hi') return statusInfo.nameHi;
    return statusInfo.name;
  };

  return (
    <span
      className={`
        inline-flex items-center px-6 py-3
        rounded-full text-kiosk-base font-semibold
        ${statusInfo.color} ${statusInfo.textColor}
      `}
    >
      {getLocalizedName()}
    </span>
  );
};

export default StatusBadge;
