import React from 'react';

const CustomLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="200"
          height="200"
          className="h-12 w-12 md:h-40 md:w-40">
          <circle
            cx="50"
            cy="50"
            r="48"
            className="fill-none stroke-primary"
            style={{
              animation: 'dash 2s linear infinite',
              strokeDasharray: 200,
              strokeDashoffset: 200,
              strokeLinecap: 'round',
              strokeWidth: 4,
            }}
          />
          <text
            x="50%"
            y="50%"
            alignmentBaseline="middle"
            textAnchor="middle"
            fill="currentColor"
            className="animate-pulse text-lg font-semibold text-primary md:text-xl">
            Loading...
          </text>
        </svg>
      </div>
    </div>
  );
};

export default CustomLoader;
