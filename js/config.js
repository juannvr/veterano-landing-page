// Configuração do site. Nada aqui é segredo: o endereço da lista de espera é público por natureza.

// Endereço que recebe os e-mails da lista de espera (POST JSON { email, source }).
// Exemplos: "https://formspree.io/f/SEU_ID" ou o endereço de um Worker próprio.
// Vazio = prévia: o formulário funciona na tela, mas nenhum e-mail é salvo (a página avisa).
export const WAITLIST_ENDPOINT = '';

// Analytics sem cookie (opcional). Exemplo com Umami: preencha os dois campos.
export const UMAMI_SRC = '';
export const UMAMI_ID = '';
