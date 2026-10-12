import "../services/artigoService.js";
import "../services/categoriaService.js";
import mensagemErro from "../../utils/mensagemErro.js";

angular.module('myApp').controller('indexCtrl', function ($scope, serviceArtigo, serviceCategoria) {
    $scope.categorias = [];
    $scope.artigos = [];
    $scope.categoriaSelecionada = null;

    $scope.buscarArtigos = (categoria) => {
        serviceArtigo.buscarArtigos(categoria.id).then(artigos => {
            $scope.categoriaSelecionada = categoria;
            $scope.artigos = artigos;
        }).catch(e => {
            alert(mensagemErro(e, `Erro ao obter artigos de: ${categoria.nome}`));
            console.log('ERROR: ', e);
        })
    }

    // Capa do card: imagem do artigo, senão a capa da categoria, senão fica o fundo neutro do css
    $scope.estiloCapa = (artigo) => {
        const capaCategoria = $scope.categoriaSelecionada && $scope.categoriaSelecionada.imagem;
        const imagem = artigo.imagem || capaCategoria;
        return imagem ? { 'background-image': `url('${imagem.url}')` } : {};
    }

    const init = () => {
        serviceCategoria.buscarCategorias().then(categorias => {
            $scope.categorias = categorias;
        }).catch(e => {
            alert(mensagemErro(e, 'Erro ao obter as categorias.'));
            console.log('ERROR: ', e);
        })
    }

    init();
});
