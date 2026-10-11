// Preços e planos. Fonte: tabela de produto (os mesmos números do app). Só existem Grátis e Premium.
// Valores em centavos; economia e preço por mês são calculados, nunca digitados.

/** @typedef {'gratis' | 'premium'} Plan */
/** @typedef {'mensal' | 'semestral' | 'anual'} Period */

export const PERIODS = /** @type {const} */ (['mensal', 'semestral', 'anual']);
export const DEFAULT_PERIOD = 'anual';

/** Preço do Premium por período. */
export const PRICE_CENTS = { mensal: 990, semestral: 4140, anual: 7200 };

/** Meses cobertos por período (o semestral cobre 6; o anual cobre 12). */
export const PERIOD_MONTHS = { mensal: 1, semestral: 6, anual: 12 };

/** @param {number} cents */
export function formatBrl(cents) {
  const reais = Math.floor(cents / 100);
  const rest = String(cents % 100).padStart(2, '0');
  return `R$ ${String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${rest}`;
}

/** @param {Period} period */
export function monthlyEquivalentCents(period) {
  return Math.round(PRICE_CENTS[period] / PERIOD_MONTHS[period]);
}

/** Economia contra pagar o mensal pelo mesmo número de meses. */
export function savings(period) {
  const full = PRICE_CENTS.mensal * PERIOD_MONTHS[period];
  const cents = full - PRICE_CENTS[period];
  return { cents, percent: Math.round((cents / full) * 100) };
}

/**
 * Textos de um cartão de plano para um período.
 * @param {Plan} plan @param {Period} period
 */
export function planText(plan, period) {
  if (plan === 'gratis') {
    return { price: 'R$ 0', per: '', oldPrice: '', total: 'Para sempre', saveBadge: '' };
  }
  const { cents, percent } = savings(period);
  const mensal = period === 'mensal';
  return {
    price: formatBrl(monthlyEquivalentCents(period)),
    per: 'por mês',
    oldPrice: mensal ? '' : formatBrl(PRICE_CENTS.mensal),
    total: mensal
      ? 'Cobrado todo mês · pode pausar nas férias'
      : `${formatBrl(PRICE_CENTS[period])} ${period === 'anual' ? 'por ano' : 'por semestre'}`,
    saveBadge: mensal ? '' : `Economize ${formatBrl(cents)} (${percent}%)`,
  };
}

/** Faixa comparativa do plano Anual: 12 meses no mensal × anual × economia. */
export function annualComparison() {
  const full = PRICE_CENTS.mensal * 12;
  const annual = PRICE_CENTS.anual;
  return {
    monthly12: formatBrl(full),
    annual: formatBrl(annual),
    annualPerMonth: `${formatBrl(monthlyEquivalentCents('anual'))} por mês`,
    saved: formatBrl(full - annual),
  };
}
