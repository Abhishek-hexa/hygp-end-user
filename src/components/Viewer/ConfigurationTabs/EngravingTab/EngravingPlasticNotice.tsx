import { InfoCircleOutlined } from '@ant-design/icons';

type EngravingPlasticNoticeProps = {
  onChangeToMetal: () => void;
  onKeepAsPlastic: () => void;
};

export const EngravingPlasticNotice = ({
  onChangeToMetal,
  onKeepAsPlastic,
}: EngravingPlasticNoticeProps) => {
  return (
    <div className="mx-4 mb-4 rounded-xl px-2 pt-6 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-primary-orange text-lg">
          <InfoCircleOutlined />
        </span>
        <p className="text-sm font-medium text-primary">
          We can only engrave on metal buckles.
        </p>
      </div>

      <div className="flex gap-3 w-full justify-center">
        <div>
          {' '}
          <button
            type="button"
            onClick={onChangeToMetal}
            className="flex-1 rounded-full bg-primary py-2 px-5 font-ranchers text-sm tracking-[0.8px] text-white hover:opacity-95 transition-colors uppercase">
            Change to Metal
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={onKeepAsPlastic}
            className="flex-1 rounded-full bg-primary-orange py-2 px-5 font-ranchers text-sm tracking-[0.8px] text-white hover:opacity-95 transition-colors uppercase">
            Keep as Plastic
          </button>
        </div>
      </div>
    </div>
  );
};
