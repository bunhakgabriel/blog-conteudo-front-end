class Artigo {
    constructor(
        id = null,
        titulo = null,
        conteudo = null,
        autor = 'Gabriel de Camargo Bunhak',
        imagem = null,
        categoria = null,
        topicos = []
    ){
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.autor = autor;
        this.imagem = imagem;
        this.categoria = categoria;
        this.topicos = topicos;
    }
}


export default Artigo;
