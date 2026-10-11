import Imagem from "./Imagem.js";
import Topico from "./Topico.js";
import SubTopico from "./SubTopico.js";

class Artigo {
    constructor(
        id = null,
        titulo = null,
        conteudo = null,
        autor = 'Gabriel de Camargo Bunhak',
        imagem = null,
        idCategoria = null,
        topicos = []
    ){
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.autor = autor;
        this.imagem = imagem;
        this.idCategoria = idCategoria;
        this.topicos = topicos;
    }

    // Converte o artigo retornado pela API para edição no painel
    static daApi(artigoApi) {
        const topicos = artigoApi.topicos.map(topico => new Topico(
            topico.titulo,
            topico.conteudo,
            Imagem.daApi(topico.imagem),
            topico.subTopicos.map(subTopico => new SubTopico(subTopico.tipo, subTopico.texto, Imagem.daApi(subTopico.imagem)))
        ));

        return new Artigo(
            artigoApi.id,
            artigoApi.titulo,
            artigoApi.conteudo,
            artigoApi.autor,
            Imagem.daApi(artigoApi.imagem),
            artigoApi.categoria.id,
            topicos
        );
    }
}


export default Artigo;
