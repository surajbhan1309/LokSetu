import React from 'react';

const DepartmentCard = ({ department, icon, name, color, onClick }) => {
  const colorClasses = {
    electricity: 'bg-electricity-light border-electricity text-electricity-dark hover:bg-electricity',
    gas: 'bg-gas-light border-gas text-gas-dark hover:bg-gas',
    water: 'bg-water-light border-water text-water-dark hover:bg-water',
    waste: 'bg-waste-light border-waste text-waste-dark hover:bg-waste',
  };

  return (
    <button
      onClick={() => onClick(department)}
      aria-label={`Select ${name} department`}
      className={`
        ${colorClasses[color]}
        border-4 rounded-kiosk-lg
        p-8 min-h-[200px]
        flex flex-col items-center justify-center gap-4
        touch-feedback
        shadow-kiosk hover:shadow-kiosk-xl
        transition-all duration-200
        w-full
      `}
    >
      <div className="text-6xl">{icon}</div>
      <div className="text-kiosk-xl font-bold text-center">{name}</div>
    </button>
  );
};

export default DepartmentCard;
