class Imagem {
    constructor(
        arquivo = null
    ){
        this.arquivo = arquivo; // File que será enviado para a API
        this.url = arquivo ? URL.createObjectURL(arquivo) : null; // url local para a prévia
        this.nome = arquivo ? arquivo.name : null;
        this.tamanho = arquivo ? arquivo.size : null;
        this.tipo = arquivo ? arquivo.type : null;
    }

    liberar() {
        if (this.url) URL.revokeObjectURL(this.url);
    }
}


export default Imagem;
