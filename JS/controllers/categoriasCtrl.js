import Imagem from "../../classes/Imagem.js";
import "../services/categoriaService.js";
import mensagemErro from "../../utils/mensagemErro.js";

// Tela de cadastro e exclusão de categorias
angular.module('myApp').controller('categoriasCtrl', function ($scope, serviceCategoria) {
    $scope.categorias = [];
    $scope.nova = { nome: '', capa: null };
    $scope.salvando = false;

    const limparFormulario = () => {
        if ($scope.nova.capa) $scope.nova.capa.liberar();
        $scope.nova = { nome: '', capa: null };
        document.querySelector('#capaCategoria').value = null;
    }

    const buscarCategorias = () => {
        serviceCategoria.buscarCategorias().then(categorias => {
            $scope.categorias = categorias;
        }).catch(e => {
            alert(mensagemErro(e, 'Erro ao obter as categorias.'));
            console.log('ERROR: ', e);
        })
    }

    // Chamado pelo onchange do input de arquivo
    $scope.capturarCapa = function (input) {
        const file = input.files[0];

        $scope.$apply(() => {
            if ($scope.nova.capa) $scope.nova.capa.liberar();
            $scope.nova.capa = file ? new Imagem(file) : null;
        });
    }

    $scope.removerCapa = () => {
        if ($scope.nova.capa) $scope.nova.capa.liberar();
        $scope.nova.capa = null;
        document.querySelector('#capaCategoria').value = null;
    }

    $scope.criarCategoria = () => {
        if (!$scope.nova.nome || !$scope.nova.nome.trim()) {
            alert('Informe o nome da categoria.');
            return;
        }

        $scope.salvando = true;
        serviceCategoria.criarCategoria($scope.nova.nome.trim(), $scope.nova.capa && $scope.nova.capa.arquivo)
            .then(() => {
                limparFormulario();
                buscarCategorias();
            })
            .catch(e => {
                alert(mensagemErro(e, 'Erro ao criar a categoria.'));
                console.log('ERROR: ', e);
            })
            .finally(() => {
                $scope.salvando = false;
            })
    }

    $scope.excluirCategoria = (categoria) => {
        if (!confirm(`Excluir a categoria "${categoria.nome}"?`)) return;

        serviceCategoria.excluirCategoria(categoria.id)
            .then(() => {
                $scope.categorias = $scope.categorias.filter(c => c.id !== categoria.id);
            })
            .catch(e => {
                alert(mensagemErro(e, 'Erro ao excluir a categoria.'));
                console.log('ERROR: ', e);
            })
    }

    buscarCategorias();
});
