# Progresso — Veterano site

## Etapa 1 — Organização ✅ (2026-10-10)
Projeto separado do app (`../veterano`). Referência de design e documentos de produto ficam fora do repositório (público).

## Etapa 3 — Landing page ✅ (2026-10-10)
Decisão do dono: o site é **somente a landing de pré-venda**, em HTML e CSS simples, **sem a parte legal** (Termos/Privacidade ficam fora). Primeiro versão em Astro foi descartada; o projeto agora é estático.
- **Página (`index.html`):** header fixo, hero com lista de espera, faixa das 4 perguntas, como funciona, 3 blocos de recurso (Faltas, Agenda, Premium), calculadora grátis, seção escura "Feito para acalmar", planos (Mensal | Semestral | Anual, Anual por padrão, comparativo do anual), FAQ (12 perguntas em `<details>`), CTA final e rodapé.
- **Preços** (versão da Atualização 05, substituída pela 06 abaixo): calculados em `js/pricing.js`.
- **Calculadora** com a regra do app (testada contra os casos do domínio do app).
- **Imagens:** telas reais do app (emulador Android, tema claro, dados de exemplo) em WebP @1x/@2x/@3x; o `make-assets` remove a engrenagem do Expo Go e o botão "Simular arquivo (dev)".
- **Qualidade:** 20 testes; Lighthouse local desktop 100/100/100/100 e celular 99/100/100/100 (após ajuste de contraste dos selos azuis); sem rolagem horizontal em 390 px.
- **Não verificado:** iOS/Safari; telas de 360 px em aparelho real; deploy no GitHub Pages (feito pelo dono em Settings → Pages).
- **Pendências do dono:** endereço da lista de espera (`js/config.js`; hoje é só prévia), domínio, analytics, imagens do iPhone (se quiser), App Store/Google Play quando lançar (trocar o formulário pelos selos).

## Atualização 06 — só Grátis e Premium ✅ (2026-10-11)
- **Planos:** 2 cartões (Grátis / Premium, Premium em destaque com "7 dias grátis" e CTA "Testar 7 dias grátis"). Premium R$ 9,90 · R$ 41,40/semestre (R$ 6,90/mês, −30%) · R$ 72,00/ano (R$ 6,00/mês, −39%). Seletor: Mensal · Semestral 30% off · Anual 39% off.
- **Comparação do anual:** R$ 118,80 → R$ 72,00, economia de R$ 46,80 (quase 5 meses grátis), calculada em `js/pricing.js`.
- **Textos:** hero, parágrafo de planos, JSON-LD e FAQ sem Standard (teste de 7 dias no Premium, uma vez por conta, inclusive importação com IA).
- **Testes:** 23 (preços, economias, HTML pré-renderizado igual ao cálculo, sem "Standard" nem preços antigos, só 2 cartões). Visual conferido em 1280 px e 390 px, sem rolagem horizontal.
- **Segurança do repositório (público):** protótipo do app e documento interno de produto foram retirados do repositório (cópia local fora do Git); histórico reescrito em um único commit.
- **Não incluído de propósito:** Termos e Privacidade (decisão do dono: o site é só a landing). O limite de 5 documentos no teste do app não aparece na landing.
