// Lista de espera: valida o e-mail e envia para o endereço configurado em js/config.js.

/** @param {string} value */
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Envia `{ email, source }` por POST (JSON) para o endpoint; resposta 2xx = salvo.
 * Serve para Formspree, Web3Forms, Basin ou um endpoint próprio. Sem endpoint, devolve 'ok'
 * só para a prévia (a página avisa que nada é salvo).
 * @param {string} email
 * @param {string} endpoint
 * @param {string} [source]
 * @param {typeof fetch} [fetcher]
 * @returns {Promise<'ok' | 'invalid' | 'error'>}
 */
export async function joinWaitlist(email, endpoint, source = 'landing', fetcher = fetch) {
  if (!isValidEmail(email)) return 'invalid';
  if (!endpoint) return 'ok';
  try {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: email.trim(), source }),
    });
    return response.ok ? 'ok' : 'error';
  } catch {
    return 'error';
  }
}
