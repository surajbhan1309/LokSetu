import React from 'react';

const ServiceCard = ({ icon, name, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        bg-white border-4 border-primary-300
        rounded-kiosk-lg p-6 min-h-[160px]
        flex flex-col items-center justify-center gap-3
        touch-feedback
        shadow-kiosk hover:shadow-kiosk-xl
        hover:border-primary-500 hover:bg-primary-50
        transition-all duration-200
        w-full
      "
    >
      <div className="text-5xl">{icon}</div>
      <div className="text-kiosk-lg font-semibold text-center text-gray-800">
        {name}
      </div>
    </button>
  );
};

export default ServiceCard;
