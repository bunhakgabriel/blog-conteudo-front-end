class SubTopico {
    constructor(
        tipo = 'paragrafo', // 'subtitulo' | 'paragrafo' | 'imagem'
        texto = '',
        imagem = null
    ){
        this.tipo = tipo;
        this.texto = texto;
        this.imagem = imagem;
    }
}


export default SubTopico;
