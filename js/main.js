import { CALC_DEFAULTS, calculateAbsences } from './calculator.js';
import { UMAMI_ID, UMAMI_SRC, WAITLIST_ENDPOINT } from './config.js';
import { annualComparison, planText } from './pricing.js';
import { isValidEmail, joinWaitlist } from './waitlist.js';

// ───────── Lista de espera ─────────
const form = document.querySelector('[data-waitlist-form]');
if (form) {
  const input = form.querySelector('input');
  const button = form.querySelector('button');
  const error = document.querySelector('[data-waitlist-error]');
  const done = document.querySelector('[data-waitlist-done]');
  const notice = document.querySelector('[data-waitlist-notice]');
  if (notice) notice.hidden = Boolean(WAITLIST_ENDPOINT);

  const showError = (message) => {
    error.textContent = message;
    error.hidden = false;
    input.setAttribute('aria-invalid', 'true');
  };
  input.addEventListener('input', () => {
    error.hidden = true;
    input.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!isValidEmail(input.value)) {
      showError('Confira o e-mail.');
      input.focus();
      return;
    }
    button.disabled = true;
    const result = await joinWaitlist(input.value, WAITLIST_ENDPOINT, 'landing');
    button.disabled = false;
    if (result === 'ok') {
      done.querySelector('[data-email]').textContent = input.value.trim();
      form.hidden = true;
      error.hidden = true;
      done.hidden = false;
    } else {
      showError('Não foi possível enviar agora. Tente de novo em instantes.');
    }
  });
}

// ───────── Calculadora de faltas ─────────
const calculator = document.querySelector('[data-calculator]');
if (calculator) {
  const state = { ...CALC_DEFAULTS };
  const limit = calculator.querySelector('[data-limit]');
  const unit = calculator.querySelector('[data-unit]');
  const how = calculator.querySelector('[data-how]');

  calculator.querySelectorAll('[data-key]').forEach((group) => {
    group.addEventListener('click', (event) => {
      const option = event.target.closest('button[data-value]');
      if (!option) return;
      state[group.dataset.key] = Number(option.dataset.value);
      group
        .querySelectorAll('button[data-value]')
        .forEach((other) => other.setAttribute('aria-pressed', String(other === option)));
      const result = calculateAbsences(state);
      limit.textContent = String(result.limit);
      unit.textContent = result.unit;
      how.textContent = result.how;
    });
  });
}

// ───────── Planos: Mensal | Semestral | Anual ─────────
const plans = document.querySelector('[data-plans]');
if (plans) {
  const tabs = plans.querySelectorAll('[role="tab"]');
  const compare = plans.querySelector('[data-compare]');
  const comparison = annualComparison();
  const fill = (name, value) => {
    const el = compare?.querySelector(`[data-compare-${name}]`);
    if (el) el.textContent = value;
  };
  fill('monthly12', comparison.monthly12);
  fill('annual', comparison.annual);
  fill('annual-per-month', comparison.annualPerMonth);
  fill('saved', comparison.saved);

  const select = (period) => {
    tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.period === period)));
    plans.querySelectorAll('[data-plan-card]').forEach((card) => {
      const text = planText(card.dataset.planCard, period);
      card.querySelector('[data-price]').textContent = text.price;
      card.querySelector('[data-per]').textContent = text.per;
      card.querySelector('[data-total]').textContent = text.total;
      const old = card.querySelector('[data-old]');
      old.textContent = text.oldPrice;
      old.hidden = !text.oldPrice;
      const save = card.querySelector('[data-save]');
      save.textContent = text.saveBadge;
      save.hidden = !text.saveBadge;
    });
    if (compare) compare.hidden = period !== 'anual';
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => select(tab.dataset.period)));
}

// ───────── Analytics sem cookie (opcional) ─────────
if (UMAMI_SRC && UMAMI_ID) {
  const script = document.createElement('script');
  script.defer = true;
  script.src = UMAMI_SRC;
  script.dataset.websiteId = UMAMI_ID;
  document.head.append(script);
}
