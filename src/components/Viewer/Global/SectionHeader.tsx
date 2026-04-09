import React from 'react';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div className="space-y-1 mb-5 lg:mb-6">
      <h3 className="text-base font-bold text-gray-900 lg:text-lg">
        {title}
      </h3>
    </div>
  );
};

export default SectionHeader;
