class Imagem {
    constructor(
        arquivo = null
    ){
        this.id = null; // preenchido quando a imagem já está salva na API (edição)
        this.arquivo = arquivo; // File que será enviado para a API
        this.url = arquivo ? URL.createObjectURL(arquivo) : null; // url local para a prévia
        this.nome = arquivo ? arquivo.name : null;
        this.tamanho = arquivo ? arquivo.size : null;
        this.tipo = arquivo ? arquivo.type : null;
    }

    // Imagem que veio da API ({ id, url, nome, tipo, tamanho })
    static daApi(imagemApi) {
        if (!imagemApi) return null;

        const imagem = new Imagem();
        Object.assign(imagem, imagemApi);
        return imagem;
    }

    liberar() {
        if (this.arquivo && this.url) URL.revokeObjectURL(this.url);
    }
}


export default Imagem;
