# Veterano site — instruções permanentes

- É **só a landing page** de pré-venda: HTML, CSS e JS simples, sem framework nem build. Sem páginas de Termos/Privacidade (decisão do dono).
- Spec, protótipos e documentos de produto ficam fora do repositório (público). Não inventar preço, plano ou texto.
- Nunca versionar código do app, protótipos nem documentos internos de produto aqui: o repositório é público.
- Preços só em `js/pricing.js` (centavos); o HTML pré-renderiza o plano Anual e um teste confere se bate. Mudou preço? Mude a fonte de produto, o `pricing.js` e o HTML juntos e rode `npm test`.
- A calculadora segue a regra do app (documentada no repositório do app): nunca divergir.
- Mesma identidade do app: Geist, azul `#2E63F0`, tom calmo, pt-BR. AA, responsivo 360–1440+, Lighthouse ≥ 95.
- "Compartilhar com a turma" e "Lançamento por campus" são backlog: não implementar.
- Nenhuma chave de API ou segredo no repositório. Analytics sem cookie.
- Nunca mostrar elementos de desenvolvimento nas imagens do app (o `make-assets` já cobre engrenagem do Expo Go e "Simular arquivo (dev)").
