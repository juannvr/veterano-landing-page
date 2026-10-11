# Veterano — landing page de pré-venda

Página única para divulgar o [Veterano](https://github.com/juannvr/Veterano) e juntar a lista de espera até o lançamento. **HTML, CSS e um pouco de JavaScript, sem build**: abriu a pasta, é o site.

- Não tem Termos nem Privacidade aqui: o site é só a landing.

## Ver no computador
```bash
npm install     # só para testes e para regerar imagens
npm start       # http://localhost:4173
```
(ou qualquer servidor estático na pasta; abrir o `index.html` direto no navegador não carrega os módulos JS.)

## Estrutura
```
index.html          a página inteira (10 seções)
css/styles.css      tokens e estilos (Geist, azul #2E63F0)
js/main.js          liga formulário, calculadora e seletor de planos
js/pricing.js       preços em centavos, economia e preço por mês
js/calculator.js    calculadora de faltas (mesma regra do app)
js/waitlist.js      validação e envio do e-mail
js/config.js        endereço da lista de espera e analytics  ← você edita aqui
img/                telas do app (WebP @1x/@2x/@3x), favicon, imagem de compartilhamento
fonts/              Geist (self-host)
tests/              testes de preços, calculadora e lista de espera
scripts/            serve.mjs (servidor local) e make-assets.mjs (gera as imagens)
```

## Publicar no GitHub Pages
1. No repositório: **Settings → Pages**.
2. **Build and deployment → Source: Deploy from a branch**. Branch **main**, pasta **/ (root)**. Salve.
3. Em cerca de um minuto o site fica em **https://juannvr.github.io/veterano-landing-page/**.

Observações:
- GitHub Pages gratuito exige repositório **público** (em repositório privado só em planos pagos).
- Os caminhos do site são relativos, então o mesmo código funciona nesse endereço e em um domínio próprio (Settings → Pages → Custom domain; depois ajuste `canonical` e `og:url`/`og:image` no `index.html`).
- Cada `git push` na `main` republica sozinho.

## Lista de espera
O formulário valida o e-mail e envia um `POST` JSON `{ "email": "...", "source": "landing" }` para o endereço em `js/config.js` (`WAITLIST_ENDPOINT`). Funciona com serviços de formulário (Formspree, Web3Forms, Basin) ou com um endpoint próprio (ex.: um Worker da Cloudflare gravando em KV/D1). **Enquanto o endereço estiver vazio, a página funciona como prévia e mostra um aviso: nenhum e-mail é salvo.**

## Analytics sem cookie (opcional)
Preencha `UMAMI_SRC` e `UMAMI_ID` em `js/config.js`. Sem eles, nada é carregado.

## Atualizar as imagens do app
As telas vêm de capturas reais do app em `.shots/` (não versionadas, 1080×2400). `npm run assets` recorta, limpa a barra de status e gera `img/screens/*.webp`, `img/og.png` e `img/apple-touch-icon.png`.

## Testes
`npm test` confere os preços (contra a tabela de produto), as economias, os casos da calculadora (contra as regras de domínio do app), a lista de espera e se os números escritos no HTML batem com o cálculo.

## Qualidade
Lighthouse (local): desktop 100/100/100/100; celular 99 de performance e 100 nas demais categorias. Responsivo de 360 a 1440+, foco visível, contraste AA, `prefers-reduced-motion` respeitado e FAQ com `<details>` (sem JS).
