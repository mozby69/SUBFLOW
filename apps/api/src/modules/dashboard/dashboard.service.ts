
import {
  getDashboardBillingsRepo,
  getDashboardCardsRepo,
  type DashboardPeriod,
} from "./dashboard.repository";

// ==========================================
// HELPERS
// ==========================================

function toNumber(value: { toNumber(): number }) {
  return value.toNumber();
}

// ==========================================
// MANILA DATE HELPERS
// ==========================================

function getManilaDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const getPart = (type: string) =>
    Number(
      parts.find((part) => part.type === type)?.value
    );

  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
  };
}

function getManilaDateKey(date: Date) {
  const { year, month, day } =
    getManilaDateParts(date);

  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

function getManilaMidnightUtc(
  year: number,
  monthIndex: number,
  day: number
) {
  // Asia/Manila is UTC+8.
  return new Date(
    Date.UTC(year, monthIndex, day) -
      8 * 60 * 60 * 1000
  );
}

// ==========================================
// DASHBOARD DATE RANGE
// ==========================================

function getDateRange(period: DashboardPeriod) {
  const now = new Date();

  const { year, month } =
    getManilaDateParts(now);

  if (period === "month") {
    return {
      start: getManilaMidnightUtc(
        year,
        month - 1,
        1
      ),

      // Exclusive: first day of next month
      end: getManilaMidnightUtc(
        year,
        month,
        1
      ),

      asOf: now,
    };
  }

  if (period === "year") {
    return {
      start: getManilaMidnightUtc(
        year,
        0,
        1
      ),

      // Exclusive: first day of next year
      end: getManilaMidnightUtc(
        year + 1,
        0,
        1
      ),

      asOf: now,
    };
  }

  // All Time: no billing date restriction
  return {
    start: undefined,
    end: undefined,
    asOf: now,
  };
}

// ==========================================
// DASHBOARD OVERVIEW SERVICE
// ==========================================

export async function getDashboardOverviewService(
  userId: number,
  period: DashboardPeriod
) {
  // ========================================
  // DATE RANGE
  // ========================================

  const range = getDateRange(period);

  const todayKey = getManilaDateKey(range.asOf);

  // ========================================
  // DATABASE QUERIES
  // ========================================

  const [billings, cardRecords] = await Promise.all([
    getDashboardBillingsRepo(userId, {
      start: range.start,
      end: range.end,
    }),

    getDashboardCardsRepo(
      userId,
      range.asOf
    ),
  ]);

  // ========================================
  // BILLING SUMMARY
  // ========================================

  let totalBilled = 0;
  let totalPaid = 0;
  let outstanding = 0;
  let overdue = 0;

  // ========================================
  // MONTHLY CHART MAP
  // ========================================

  const monthlyMap = new Map<
    string,
    {
      month: string;
      billed: number;
      paid: number;
    }
  >();

  // ========================================
  // CATEGORY CHART MAP
  // ========================================

  const categoryMap = new Map<string, number>();

  // ========================================
  // PROCESS BILLINGS
  // ========================================

  const recentBillings = billings.map((billing) => {
    const amount = toNumber(billing.amount);

    const paidAmount = toNumber(
      billing.paidAmount
    );

    const remaining = Math.max(
      0,
      amount - paidAmount
    );

    const cancelled =
      billing.status === "CANCELLED";

    // Billing dates are treated as calendar dates.
    // This assumes dueDate is stored at UTC midnight.
    const dueDateKey = billing.dueDate
      .toISOString()
      .slice(0, 10);

    // ======================================
    // OVERDUE CALCULATION
    // ======================================

    const isOverdue =
      !cancelled &&
      remaining > 0 &&
      dueDateKey < todayKey;

    // ======================================
    // CATEGORY
    // ======================================

    const category =
      billing.subscription.subscriptionCategory
        ?.name ??
      billing.subscription.category ??
      "Uncategorized";

    // ======================================
    // BILLING TOTALS
    // ======================================

    if (!cancelled) {
      totalBilled += amount;

      totalPaid += paidAmount;

      outstanding += remaining;

      if (isOverdue) {
        overdue += remaining;
      }

      // ====================================
      // MONTHLY CHART
      // ====================================

      const monthKey = dueDateKey.slice(0, 7);

      const existingMonth =
        monthlyMap.get(monthKey) ?? {
          month: monthKey,
          billed: 0,
          paid: 0,
        };

      existingMonth.billed += amount;

      existingMonth.paid += paidAmount;

      monthlyMap.set(
        monthKey,
        existingMonth
      );

      // ====================================
      // CATEGORY CHART
      // ====================================

      categoryMap.set(
        category,
        (categoryMap.get(category) ?? 0) +
          amount
      );
    }

    // ======================================
    // CREDIT CARD DISPLAY
    // ======================================

    const card =
      billing.subscription.card;

    const cardDisplay = card
      ? [
          card.network,
          "••••",
          String(
            card.last_four_digit
          ).padStart(4, "0"),
        ].join(" ")
      : "No card";

    // ======================================
    // RECENT BILLING RESPONSE
    // ======================================

    return {
      id: billing.id,

      name:
        billing.subscription.subscriptionName,

      category,

      dueDate: dueDateKey,

      amount,

      paidAmount,

      status: isOverdue
        ? "OVERDUE"
        : billing.status,

      card: cardDisplay,
    };
  });

  // ========================================
  // CREDIT CARD OVERVIEW
  // ========================================

  const cards = cardRecords.map((card) => {
    // ======================================
    // TOTAL CARD CHARGES
    // ======================================

    const totalCharges = card.charges.reduce(
      (sum, charge) =>
        sum + toNumber(
          charge.postedAmount
        ),
      0
    );

    // ======================================
    // TOTAL CARD PAYMENTS
    // ======================================

    const totalPayments =
      card.cardPayments.reduce(
        (sum, payment) =>
          sum + toNumber(
            payment.amount
          ),
        0
      );

    // ======================================
    // CARD OUTSTANDING
    // ======================================

    const cardOutstanding =
      totalCharges - totalPayments;

    return {
      id: card.id,

      bank: card.bank,

      network: card.network,

      lastFour: String(
        card.last_four_digit
      ).padStart(4, "0"),

      creditLimit: toNumber(
        card.creditLimit
      ),

      outstanding: cardOutstanding,

      status: card.status,
    };
  });

  // ========================================
  // CREDIT CARD TOTALS
  // ========================================

  const totalCreditLimit = cards.reduce(
    (sum, card) =>
      sum + card.creditLimit,
    0
  );

  const totalCardOutstanding = cards.reduce(
    (sum, card) =>
      sum + card.outstanding,
    0
  );

  const availableCredit =
    totalCreditLimit -
    totalCardOutstanding;

  // ========================================
  // MONTHLY CHART DATA
  // ========================================

  const monthlyData = Array.from(
    monthlyMap.values()
  ).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  // ========================================
  // CATEGORY CHART DATA
  // ========================================

  const categoryData = Array.from(
    categoryMap.entries()
  ).map(([name, value]) => ({
    name,
    value,
  }));

  // ========================================
  // FINAL RESPONSE
  // ========================================

  return {
    period,

    currencyCode: "PHP",

    summary: {
      totalBilled,
      totalPaid,
      outstanding,
      overdue,
    },

    creditSummary: {
      totalCreditLimit,
      totalCardOutstanding,
      availableCredit,
      totalCards: cards.length,
    },

    monthlyData,

    categoryData,

    cards,

    recentBillings:
      recentBillings.slice(0, 10),
  };
}
