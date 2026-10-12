class Topico {
    constructor(
        titulo = null,
        conteudo = null,
        imagem = null,
        subTopicos = []
    ){
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.imagem = imagem;
        this.subTopicos = subTopicos;
    }
}


export default Topico;
