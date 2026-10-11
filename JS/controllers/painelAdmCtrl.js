import Artigo from "../../classes/Artigo.js"
import Imagem from "../../classes/Imagem.js";
import Topico from "../../classes/Topico.js";
import SubTopico from "../../classes/SubTopico.js";
import "../services/artigoService.js";
import "../services/categoriaService.js";
import mensagemErro from "../../utils/mensagemErro.js";

// Tela de cadastro e edição de artigo. Edição: painelAdm.html?id={idArtigo}
angular.module('myApp').controller('painelAdmCtrl', function ($scope, $uibModal, serviceArtigo, serviceCategoria) {
    $scope.vm = new Artigo();
    $scope.categorias = [];
    $scope.editando = false;
    $scope.salvando = false;

    const limparInputsArquivo = () => {
        document.querySelectorAll('input[type="file"]').forEach(input => input.value = null);
    }

    $scope.save = () => {
        if (!$scope.vm.titulo || !$scope.vm.idCategoria) {
            alert('Informe o título e a categoria do artigo.');
            return;
        }

        $scope.salvando = true;
        serviceArtigo.salvarArtigo($scope.vm)
            .then(resposta => {
                alert(resposta.message);

                if ($scope.editando) {
                    window.location.href = 'artigos.html';
                    return;
                }

                $scope.vm = new Artigo();
                limparInputsArquivo();
            })
            .catch(e => {
                alert(mensagemErro(e, 'Falha ao salvar artigo.'));
                console.log('ERROR: ', e);
            })
            .finally(() => {
                $scope.salvando = false;
            })
    }

    $scope.previa = function () {
        $uibModal.open({
            templateUrl: '.././views/modais/previa.html',
            controller: 'painelAdmModalCtrl',
            size: 'lg',
            windowClass: 'modal-centered',
            resolve: {
                modal: function () {
                    return {
                        vm: $scope.vm
                    };
                }
            }
        });
    };

    $scope.addItem = (item, index) => {
        if (item === 'topico') {
            $scope.vm.topicos.push(new Topico());
        }
        else if (item === 'subtitulo' || item === 'paragrafo' || item === 'imagem') {
            $scope.vm.topicos[index].subTopicos.push(new SubTopico(item));
        }
    }

    $scope.removeItem = (item, index) => {
        if (item === 'paragrafo') {
            $scope.vm.topicos[index].subTopicos.pop();
        }
    }

    $scope.removerTopico = (indexTopico) => {
        if (!confirm('Remover este tópico e todo o conteúdo dele?')) return;
        $scope.vm.topicos.splice(indexTopico, 1);
    }

    $scope.removerSubTopico = (topico, indexSubTopico) => {
        const [removido] = topico.subTopicos.splice(indexSubTopico, 1);
        if (removido && removido.imagem) removido.imagem.liberar();
    }

    // Chamado pelo onchange do input, o scope do input já tem o item (vm, topico ou subTopico) do ng-repeat
    $scope.capturarImagem = function (input, action) {
        const file = input.files[0];
        if (!file) return;

        const scopeInput = angular.element(input).scope();
        const item = { artigo: $scope.vm, topico: scopeInput.topico, subTopico: scopeInput.subTopico }[action];

        $scope.$apply(() => {
            if (item.imagem) item.imagem.liberar();
            item.imagem = new Imagem(file);
        });
    }

    $scope.removerImagem = (item, event) => {
        const inputElement = event.target.closest('div').querySelector('input[type="file"]');
        angular.element(inputElement).val(null);

        if (item.imagem) item.imagem.liberar();
        item.imagem = null;
    }

    const init = () => {
        serviceCategoria.buscarCategorias().then(categorias => {
            $scope.categorias = categorias;
        }).catch(e => {
            alert(mensagemErro(e, 'Erro ao obter as categorias.'));
            console.log('ERROR: ', e);
        })

        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) return;

        $scope.editando = true;
        serviceArtigo.buscarArtigoId(id).then(artigo => {
            $scope.vm = Artigo.daApi(artigo);
        }).catch(e => {
            alert(mensagemErro(e, 'Erro ao buscar o artigo.'));
            console.log('ERROR: ', e);
        })
    }

    init();

}).controller('painelAdmModalCtrl', function ($scope, $uibModalInstance, modal) {
    $scope.vm = modal.vm;

    $scope.close = () => {
        $uibModalInstance.close();
    }
});
