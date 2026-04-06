import { HourglassOutlined } from '@ant-design/icons';

export const ComingSoon = ({ label }: { label: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
      {/* Hourglass / waiting animation */}
      <div className="relative flex items-center justify-center">
        <div className="h-22 w-22 rounded-full border-4 border-dashed border-[#86a69e] animate-[spin_8s_linear_infinite] opacity-40" />
        <div className="absolute h-16 w-16 rounded-full border-4 border-dashed border-[#f28783] animate-[spin_5s_linear_infinite_reverse] opacity-50" />
        <span className="absolute text-3xl">
          <HourglassOutlined className="text-3xl text-[#558a7e]" />
        </span>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2">
        <p className="font-ranchers text-2xl uppercase tracking-widest text-[#558a7e]">
          Coming Soon
        </p>
        <p className="text-sm uppercase tracking-wider text-[#86a69e]">
          {label} will be available in the future
        </p>
      </div>

      {/* Slow idle dots — not bouncing fast, just gently pulsing */}
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#f28783] animate-pulse"
            style={{
              animationDelay: `${i * 0.4}s`,
              animationDuration: '2.4s',
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Subtle tagline */}
      <p className="text-xs uppercase tracking-[0.2em] text-[#86a69e] opacity-50">
        We&apos;re working on it
      </p>
    </div>
  );
};
