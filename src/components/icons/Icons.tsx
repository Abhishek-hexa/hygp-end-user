export const LeftArrowIcon = ({ className }: { className?: string }) => (
  <svg
    width="10"
    height="18"
    viewBox="0 0 10 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M9 1L1 9L9 17"
      stroke="#F28582"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const RightArrowIcon = ({ className }: { className?: string }) => (
  <svg
    width="10"
    height="18"
    viewBox="0 0 10 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M1 1L9 9L1 17"
      stroke="#F28582"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SelectedItemIcon = ({
  className,
  fillColor = '#558A7E',
  version = 'default',
}: {
  className?: string;
  fillColor?: string;
  version?: 'default' | 'white';
}) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M10 0.893262C11.0055 1.47383 11.842 2.30695 12.4265 3.31013C13.0111 4.31331 13.3236 5.45178 13.333 6.61282C13.3423 7.77387 13.0483 8.91723 12.48 9.92973C11.9117 10.9422 11.0888 11.7887 10.0928 12.3855C9.09683 12.9822 7.96224 13.3085 6.8014 13.332C5.64055 13.3555 4.4937 13.0754 3.47437 12.5194C2.45504 11.9635 1.59858 11.1509 0.989778 10.1623C0.380975 9.1736 0.0409395 8.04307 0.00333341 6.8826L0 6.66659L0.00333341 6.45059C0.0406688 5.29926 0.375698 4.17724 0.97576 3.19392C1.57582 2.21061 2.42044 1.39956 3.42726 0.83985C4.43409 0.280137 5.56876 -0.00914052 6.72067 0.000220164C7.87258 0.00958085 9.0024 0.31726 10 0.893262ZM9.138 4.86193C9.0232 4.74714 8.87047 4.67819 8.70845 4.668C8.54644 4.65782 8.38627 4.70709 8.258 4.8066L8.19533 4.86193L6 7.05659L5.138 6.19526L5.07533 6.13993C4.94706 6.0405 4.78691 5.99128 4.62494 6.0015C4.46296 6.01172 4.31027 6.08067 4.19551 6.19544C4.08074 6.3102 4.01179 6.46289 4.00157 6.62486C3.99135 6.78684 4.04057 6.94698 4.14 7.07526L4.19533 7.13793L5.52867 8.47126L5.59133 8.5266C5.70825 8.61731 5.85202 8.66654 6 8.66654C6.14798 8.66654 6.29175 8.61731 6.40867 8.5266L6.47133 8.47126L9.138 5.80459L9.19333 5.74193C9.29283 5.61366 9.34211 5.45349 9.33193 5.29147C9.32174 5.12946 9.25278 4.97672 9.138 4.86193Z"
      fill={version === 'white' ? '#FFFFFF' : fillColor}
    />
  </svg>
);

export const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CancelIcon = ({ className }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M10.5 3.5L3.5 10.5"
      stroke="black"
      strokeOpacity="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.5 3.5L10.5 10.5"
      stroke="black"
      strokeOpacity="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 20H7"
      stroke="#85A59D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 20H21"
      stroke="#85A59D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.89844 15H13.7984"
      stroke="#85A59D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.2031 6.30078L16.0031 20.0008"
      stroke="#85A59D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 20L11 4H13L20 20"
      stroke="#85A59D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TextIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 8V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
      stroke="#84A49D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 16V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H8"
      stroke="#84A49D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V8"
      stroke="#84A49D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V16"
      stroke="#84A49D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 16V9"
      stroke="#84A49D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 9H15"
      stroke="#84A49D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CartIcon = ({
  className,
  stroke = '#333333',
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 17.001C6.53043 17.001 7.03914 17.2117 7.41421 17.5868C7.78929 17.9618 8 18.4705 8 19.001C8 19.5314 7.78929 20.0401 7.41421 20.4152C7.03914 20.7903 6.53043 21.001 6 21.001C5.46957 21.001 4.96086 20.7903 4.58579 20.4152C4.21071 20.0401 4 19.5314 4 19.001C4 18.4705 4.21071 17.9618 4.58579 17.5868C4.96086 17.2117 5.46957 17.001 6 17.001ZM6 17.001H17M6 17.001V3.00098H4M17 17.001C17.5304 17.001 18.0391 17.2117 18.4142 17.5868C18.7893 17.9618 19 18.4705 19 19.001C19 19.5314 18.7893 20.0401 18.4142 20.4152C18.0391 20.7903 17.5304 21.001 17 21.001C16.4696 21.001 15.9609 20.7903 15.5858 20.4152C15.2107 20.0401 15 19.5314 15 19.001C15 18.4705 15.2107 17.9618 15.5858 17.5868C15.9609 17.2117 16.4696 17.001 17 17.001ZM6 5.00098L20 6.00098L19 13.001H6"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CategoryIcon = ({
  className,
  stroke = '#558A7E',
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.75 13.75H16.75M13.75 10.75V16.75M0.75 0.75H6.75V6.75H0.75V0.75ZM10.75 0.75H16.75V6.75H10.75V0.75ZM0.75 10.75H6.75V16.75H0.75V10.75Z"
      stroke={stroke}
      strokeOpacity="0.5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CartModalOpenIcon = ({
  className,
}: {
  className?: string;
  stroke?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={className}>
    <g clip-path="url(#clip0_8430_12976)">
      <path
        d="M5 12.5L10 7.5L15 12.5"
        stroke="#558A7E"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_8430_12976">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="matrix(1 0 0 -1 0 20)"
        />
      </clipPath>
    </defs>
  </svg>
);
