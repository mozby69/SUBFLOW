export const formatCurrency = (
  amount: number | string,
  currencyCode: string = "PHP"
): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

// const currencyFormatter = new Intl.NumberFormat(
//   "en-PH",
//   {
//     style: "currency",
//     currency: "PHP",
//   }
// );

export const dateFormatter = new Intl.DateTimeFormat(
  "en-PH",
  {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }
);