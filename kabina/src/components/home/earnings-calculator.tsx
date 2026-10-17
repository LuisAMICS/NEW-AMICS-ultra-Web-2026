"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/client";
import { estimateMonthlyEarnings } from "@/lib/pricing";
import { formatMoney } from "@/lib/utils";

export function EarningsCalculator() {
  const { t, locale } = useT();
  const [rate, setRate] = useState(40);
  const [hours, setHours] = useState(20);
  const monthly = estimateMonthlyEarnings(rate * 100, hours);
  return (
    <div className="rounded-3xl bg-white p-6 shadow-float ring-1 ring-ink-950/5">
      <h3 className="text-lg font-bold">{t.home.calculatorTitle}</h3>
      <div className="mt-5 space-y-5">
        <label className="block">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-ink-700">{t.home.calculatorRate}</span>
            <span className="font-bold">{formatMoney(rate * 100, "EUR", locale, { compact: true })}</span>
          </div>
          <input type="range" min={10} max={200} step={5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-2 w-full accent-ink-950" />
        </label>
        <label className="block">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-ink-700">{t.home.calculatorHours}</span>
            <span className="font-bold">{hours} h</span>
          </div>
          <input type="range" min={5} max={60} step={1} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="mt-2 w-full accent-ink-950" />
        </label>
      </div>
      <div className="mt-6 rounded-2xl bg-ink-950 p-5 text-white">
        <p className="font-display text-4xl font-bold text-brand-300">{formatMoney(monthly, "EUR", locale, { compact: true })}</p>
        <p className="mt-1 text-sm text-ink-300">{t.home.calculatorEarnings}</p>
      </div>
      <p className="mt-3 text-xs text-ink-500">{t.home.calculatorNote}</p>
    </div>
  );
}
