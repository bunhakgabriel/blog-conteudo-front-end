import "../services/artigoService.js";
import "../services/categoriaService.js";
import mensagemErro from "../../utils/mensagemErro.js";

// Tela de gerenciamento: lista os artigos com as ações de ver, editar e excluir
angular.module('myApp').controller('artigosCtrl', function ($scope, serviceArtigo, serviceCategoria) {
    $scope.artigos = [];
    $scope.categorias = [];
    $scope.filtro = { idCategoria: null };
    $scope.carregando = false;

    $scope.buscarArtigos = () => {
        $scope.carregando = true;
        serviceArtigo.buscarArtigos($scope.filtro.idCategoria).then(artigos => {
            $scope.artigos = artigos;
        }).catch(e => {
            alert(mensagemErro(e, 'Erro ao obter os artigos.'));
            console.log('ERROR: ', e);
        }).finally(() => {
            $scope.carregando = false;
        })
    }

    $scope.excluirArtigo = (artigo) => {
        if (!confirm(`Excluir o artigo "${artigo.titulo}"?\nAs imagens dele também serão apagadas. Essa ação não pode ser desfeita.`)) return;

        serviceArtigo.excluirArtigo(artigo.id).then(resposta => {
            $scope.artigos = $scope.artigos.filter(a => a.id !== artigo.id);
            alert(resposta.message);
        }).catch(e => {
            alert(mensagemErro(e, 'Erro ao excluir o artigo.'));
            console.log('ERROR: ', e);
        })
    }

    const init = () => {
        serviceCategoria.buscarCategorias().then(categorias => {
            $scope.categorias = categorias;
        }).catch(e => {
            console.log('ERROR: ', e);
        })

        $scope.buscarArtigos();
    }

    init();
});
