import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';

import { calculateAbsences, CALC_DEFAULTS } from '../js/calculator.js';
import {
  annualComparison,
  formatBrl,
  monthlyEquivalentCents,
  planText,
  PRICE_CENTS,
  savings,
} from '../js/pricing.js';
import { isValidEmail, joinWaitlist } from '../js/waitlist.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

describe('preços', () => {
  it('valores exatos do Premium por período', () => {
    expect(PRICE_CENTS).toEqual({ mensal: 990, semestral: 4140, anual: 7200 });
  });

  it('formata em reais com vírgula', () => {
    expect(formatBrl(990)).toBe('R$ 9,90');
    expect(formatBrl(4140)).toBe('R$ 41,40');
    expect(formatBrl(7200)).toBe('R$ 72,00');
  });

  it('preço por mês equivalente', () => {
    expect(formatBrl(monthlyEquivalentCents('mensal'))).toBe('R$ 9,90');
    expect(formatBrl(monthlyEquivalentCents('semestral'))).toBe('R$ 6,90');
    expect(formatBrl(monthlyEquivalentCents('anual'))).toBe('R$ 6,00');
  });

  it('economia bate com o documento', () => {
    expect(savings('semestral')).toEqual({ cents: 1800, percent: 30 });
    expect(savings('anual')).toEqual({ cents: 4680, percent: 39 });
  });

  it('textos do Premium anual', () => {
    expect(planText('premium', 'anual')).toEqual({
      price: 'R$ 6,00',
      per: 'por mês',
      oldPrice: 'R$ 9,90',
      total: 'R$ 72,00 por ano',
      saveBadge: 'Economize R$ 46,80 (39%)',
    });
  });

  it('textos do Premium semestral', () => {
    expect(planText('premium', 'semestral')).toMatchObject({
      price: 'R$ 6,90',
      total: 'R$ 41,40 por semestre',
      saveBadge: 'Economize R$ 18,00 (30%)',
    });
  });

  it('mensal não tem selo nem preço riscado', () => {
    expect(planText('premium', 'mensal')).toMatchObject({
      price: 'R$ 9,90',
      oldPrice: '',
      saveBadge: '',
    });
  });

  it('faixa comparativa do anual', () => {
    expect(annualComparison()).toMatchObject({
      monthly12: 'R$ 118,80',
      annual: 'R$ 72,00',
      annualPerMonth: 'R$ 6,00 por mês',
      saved: 'R$ 46,80',
    });
  });

  it('o HTML pré-renderizado (Anual) usa os mesmos números do cálculo', () => {
    const text = planText('premium', 'anual');
    for (const value of [text.price, text.oldPrice, text.total, text.saveBadge]) {
      expect(html).toContain(value);
    }
    const compare = annualComparison();
    for (const value of [compare.monthly12, compare.annual, compare.annualPerMonth, compare.saved]) {
      expect(html).toContain(value);
    }
  });

  it('não sobrou o plano Standard nem os preços antigos', () => {
    expect(html).not.toMatch(/Standard/i);
    for (const old of ['R$ 4,90', 'R$ 36,00', 'R$ 23,00', 'R$ 74,25', 'R$ 48,00']) {
      expect(html).not.toContain(old);
    }
  });

  it('a importação se chama "Documento da matéria" (não só plano de ensino)', () => {
    expect(html).toContain('documento da matéria');
    expect(html).toContain('Importar matrícula, documentos das matérias e histórico com IA');
    expect(html).not.toContain('Importar matrícula, plano de ensino e histórico com IA');
  });

  it('há só dois cartões de plano: Grátis e Premium', () => {
    expect([...html.matchAll(/data-plan-card="(\w+)"/g)].map((m) => m[1])).toEqual(['gratis', 'premium']);
  });
});

describe('calculadora de faltas (casos do domínio do app, 55 min e 75%)', () => {
  const calc = (workloadHours, classesPerDay) =>
    calculateAbsences({ ...CALC_DEFAULTS, workloadHours, classesPerDay });

  it('60 h, 2 aulas por dia: 33 dias e limite 8', () => {
    expect(calc(60, 2)).toMatchObject({ classDays: 33, limit: 8 });
  });
  it('45 h, 3 aulas por dia: 16 dias e limite 4', () => {
    expect(calc(45, 3)).toMatchObject({ classDays: 16, limit: 4 });
  });
  it('60 h, 4 aulas por dia: 16 dias e limite 4', () => {
    expect(calc(60, 4)).toMatchObject({ classDays: 16, limit: 4 });
  });
  it('30 h, 2 aulas por dia: 16 dias e limite 4', () => {
    expect(calc(30, 2)).toMatchObject({ classDays: 16, limit: 4 });
  });
  it('padrão da página (o mesmo texto pré-renderizado no HTML)', () => {
    const result = calculateAbsences(CALC_DEFAULTS);
    expect(result.limit).toBe(8);
    expect(result.how).toBe('60 h ÷ (2 × 55 min) = 33 dias de aula. 25% disso = 8.');
    expect(html).toContain(result.how);
  });
  it('singular quando o limite é 1', () => {
    expect(
      calculateAbsences({ workloadHours: 30, classesPerDay: 4, classMinutes: 60, minAttendance: 80 }),
    ).toMatchObject({ limit: 1, unit: 'dia de aula' });
  });
  it('nunca menos de 1 dia de aula', () => {
    expect(
      calculateAbsences({ workloadHours: 1, classesPerDay: 4, classMinutes: 60, minAttendance: 75 })
        .classDays,
    ).toBe(1);
  });
});

describe('lista de espera', () => {
  it('valida o e-mail', () => {
    expect(isValidEmail('juan@exemplo.com')).toBe(true);
    expect(isValidEmail('  juan@exemplo.com ')).toBe(true);
    expect(isValidEmail('juan@')).toBe(false);
    expect(isValidEmail('juan exemplo@x.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('e-mail inválido nunca chama a rede', async () => {
    const fetcher = vi.fn();
    expect(await joinWaitlist('oi', 'https://x.test', 'landing', fetcher)).toBe('invalid');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('envia JSON com o e-mail limpo', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true });
    expect(await joinWaitlist(' a@b.co ', 'https://x.test/lista', 'hero', fetcher)).toBe('ok');
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe('https://x.test/lista');
    expect(JSON.parse(init.body)).toEqual({ email: 'a@b.co', source: 'hero' });
  });

  it('erro do servidor e falha de rede viram "error"', async () => {
    const serverError = vi.fn().mockResolvedValue({ ok: false });
    const offline = vi.fn().mockRejectedValue(new Error('off'));
    expect(await joinWaitlist('a@b.co', 'https://x.test', 'x', serverError)).toBe('error');
    expect(await joinWaitlist('a@b.co', 'https://x.test', 'x', offline)).toBe('error');
  });

  it('sem endpoint, a prévia aceita (e a página avisa)', async () => {
    expect(await joinWaitlist('a@b.co', '')).toBe('ok');
  });
});
