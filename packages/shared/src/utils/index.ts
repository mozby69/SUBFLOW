export function formatCurrency(
    amount: number,
    locale = "en-PH",
    currency = "PHP"
) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}


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