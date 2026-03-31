interface LineItem {
  label: string;
  value: string;
}

interface PriceSummaryDetailsProps {
  lineItems: LineItem[];
  totalAmount: string;
  shippingCopy: string;
}

export const PriceSummaryDetails = ({
  lineItems,
  totalAmount,
  shippingCopy,
}: PriceSummaryDetailsProps) => {
  return (
    <section className="rounded-2xl border border-border-gray-dark bg-selected px-4 md:px-7 py-6">
      <div className="space-y-4 text-sm font-semibold text-primary-dark border-b border-primary-dark pb-6">
        {lineItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between uppercase">
            <span>{item.label}</span>
            <span>${item.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-base md:text-lg font-semibold text-text-dark-green uppercase py-4">
        <span>TOTAL AMOUNT</span>
        <span>${totalAmount}</span>
      </div>

      <p className="text-center text-sm md:text-base text-text-light-green">
        {shippingCopy}
      </p>
    </section>
  );
};
