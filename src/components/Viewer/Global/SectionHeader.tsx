import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="space-y-1 mb-5 lg:mb-6">
      <h3 className="text-base font-bold text-gray-900 lg:text-[20px]">
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-gray-500 lg:text-base">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
