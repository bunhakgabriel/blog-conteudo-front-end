// Mensagem de erro vinda da API (fail() ou errorMiddleware), usada nos alerts das telas
const mensagemErro = (e, padrao) => (e && e.data && e.data.message) ? e.data.message : padrao;

export default mensagemErro;
