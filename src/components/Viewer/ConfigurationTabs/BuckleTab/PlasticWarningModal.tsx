import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

type PlasticWarningModalProps = {
  onKeepAsMetal: () => void;
  onChangeToPlastic: () => void;
};

export const PlasticWarningModal = ({
  onKeepAsMetal,
  onChangeToPlastic,
}: PlasticWarningModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.25)' }}>
      <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white px-6 pb-6 pt-5 shadow-xl">
        {/* Close (acts as Keep as Metal) */}
        <button
          type="button"
          onClick={onKeepAsMetal}
          className="absolute right-3 top-3 flex items-center justify-center rounded-full transition-colors text-base leading-none">
          <CloseCircleOutlined className="text-xl hover:scale-105 transition-transform 0.2s" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-primary-orange text-lg">
            <InfoCircleOutlined />
          </span>
          <h2 className="text-primary-orange font-semibold text-lg">
            Please Notice
          </h2>
        </div>

        {/* Body */}
        <p className="text-center text-primary font-medium text-base mb-5">
          We can only engrave on metal buckles.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onKeepAsMetal}
            className="flex-1 rounded-full bg-primary py-2 font-ranchers text-sm tracking-[0.8px] text-white hover:opacity-95 transition-colors uppercase">
            Keep as Metal
          </button>
          <button
            type="button"
            onClick={onChangeToPlastic}
            className="flex-1 rounded-full bg-primary-orange py-2 font-ranchers text-sm tracking-[0.8px] text-white hover:opacity-95 transition-colors uppercase">
            Change to Plastic
          </button>
        </div>
      </div>
    </div>
  );
};
