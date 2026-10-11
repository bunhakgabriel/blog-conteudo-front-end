import { API_URL } from "../apiConfig.js";

// Monta o multipart esperado pela API: campo "artigo" com o JSON e cada imagem nova como um arquivo.
// No JSON, a imagem é o nome do campo do arquivo novo, o id da imagem já salva (edição) ou null
const montarFormData = (artigo) => {
    const formData = new FormData();

    const referenciaImagem = (imagem, campo) => {
        if (!imagem) return null;
        if (imagem.arquivo) {
            formData.append(campo, imagem.arquivo);
            return campo;
        }
        return imagem.id || null;
    };

    const dados = {
        titulo: artigo.titulo,
        conteudo: artigo.conteudo,
        autor: artigo.autor,
        idCategoria: artigo.idCategoria,
        imagem: referenciaImagem(artigo.imagem, 'capa'),
        topicos: artigo.topicos.map((topico, indexTopico) => ({
            titulo: topico.titulo,
            conteudo: topico.conteudo,
            imagem: referenciaImagem(topico.imagem, `topico-${indexTopico}`),
            subTopicos: topico.subTopicos
                // subtópico de imagem sem imagem selecionada não é enviado
                .filter(subTopico => subTopico.tipo !== 'imagem' || (subTopico.imagem && (subTopico.imagem.arquivo || subTopico.imagem.id)))
                .map((subTopico, indexSub) => ({
                    tipo: subTopico.tipo,
                    texto: subTopico.tipo === 'imagem' ? null : subTopico.texto,
                    imagem: referenciaImagem(subTopico.imagem, `topico-${indexTopico}-sub-${indexSub}`)
                }))
        }))
    };

    formData.append('artigo', JSON.stringify(dados));
    return formData;
}

// A API responde no formato { success, data, message }
angular.module('myApp').factory('serviceArtigo', ['$http', function ($http) {
    const configMultipart = {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined } // o navegador define o multipart com o boundary
    };

    return {
        buscarArtigos: (idCategoria) => {
            return $http.get(`${API_URL}/artigos`, { params: { categoria: idCategoria } })
                .then(response => response.data.data);
        },
        buscarArtigoId: (id) => {
            return $http.get(`${API_URL}/artigos/${id}`)
                .then(response => response.data.data);
        },
        salvarArtigo: (artigo) => {
            const formData = montarFormData(artigo);
            const requisicao = artigo.id
                ? $http.put(`${API_URL}/artigos/${artigo.id}`, formData, configMultipart)
                : $http.post(`${API_URL}/artigos`, formData, configMultipart);

            return requisicao.then(response => response.data);
        },
        excluirArtigo: (id) => {
            return $http.delete(`${API_URL}/artigos/${id}`)
                .then(response => response.data);
        }
    }
}]);
