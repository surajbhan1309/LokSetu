import React from 'react';
import { REQUEST_STATUS } from '../utils/constants';
import { useTranslation } from 'react-i18next';

const StatusTimeline = ({ currentStatus }) => {
  const { t } = useTranslation();

  const steps = [
    { status: REQUEST_STATUS.SUBMITTED, label: t('status.submitted') },
    { status: REQUEST_STATUS.IN_PROGRESS, label: t('status.inProgress') },
    { status: REQUEST_STATUS.RESOLVED, label: t('status.resolved') },
  ];

  const getCurrentStepIndex = () => {
    if (currentStatus === REQUEST_STATUS.REJECTED) {
      return 1; // rejected usually occurs after review/in-progress
    }
    return steps.findIndex((step) => step.status === currentStatus);
  };

  const currentIndex = getCurrentStepIndex();
  const progressPercent = Math.max(0, (currentIndex / (steps.length - 1)) * 100);

  return (
    <div className="w-full py-8">
      {currentStatus === REQUEST_STATUS.REJECTED && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-kiosk">
          <p className="text-kiosk-base text-red-600 text-center font-semibold">
            This request is marked as Rejected.
          </p>
        </div>
      )}
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.status} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  text-kiosk-base font-bold mb-3
                  ${
                    isCompleted
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                  ${isCurrent ? 'ring-4 ring-primary-200 scale-110' : ''}
                  transition-all duration-300
                `}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <div
                className={`
                  text-kiosk-sm font-semibold text-center
                  ${isCompleted ? 'text-primary-600' : 'text-gray-500'}
                `}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTimeline;
