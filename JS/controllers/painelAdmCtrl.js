import Artigo from "../../classes/Artigo.js"
import Imagem from "../../classes/Imagem.js";
import Topico from "../../classes/Topico.js";
import SubTopico from "../../classes/SubTopico.js";
import { API_URL } from "../apiConfig.js";

// Monta o multipart esperado pela API: campo "artigo" com o JSON
// e cada imagem como um arquivo, referenciado no JSON pelo nome do campo
const montarFormData = (artigo) => {
    const formData = new FormData();

    const anexarImagem = (imagem, campo) => {
        if (!imagem || !imagem.arquivo) return null;
        formData.append(campo, imagem.arquivo);
        return campo;
    };

    const dados = {
        titulo: artigo.titulo,
        conteudo: artigo.conteudo,
        autor: artigo.autor,
        categoria: artigo.categoria,
        imagem: anexarImagem(artigo.imagem, 'capa'),
        topicos: artigo.topicos.map((topico, indexTopico) => ({
            titulo: topico.titulo,
            conteudo: topico.conteudo,
            imagem: anexarImagem(topico.imagem, `topico-${indexTopico}`),
            subTopicos: topico.subTopicos
                // subtópico de imagem sem arquivo selecionado não é enviado
                .filter(subTopico => subTopico.tipo !== 'imagem' || (subTopico.imagem && subTopico.imagem.arquivo))
                .map((subTopico, indexSub) => ({
                    tipo: subTopico.tipo,
                    texto: subTopico.tipo === 'imagem' ? null : subTopico.texto,
                    imagem: anexarImagem(subTopico.imagem, `topico-${indexTopico}-sub-${indexSub}`)
                }))
        }))
    };

    formData.append('artigo', JSON.stringify(dados));
    return formData;
}

angular.module('myApp').factory('servicePainel', ['$http', function ($http) {
    return {
        salvarArtigo: (artigo) => {
            return $http.post(`${API_URL}/artigos`, montarFormData(artigo), {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined } // o navegador define o multipart com o boundary
            }).then(response => response.data);
        }
    }
}]).controller('painelAdmCtrl', function ($scope, $uibModal, servicePainel) {
    $scope.vm = new Artigo();

    $scope.save = () => {
        if (!$scope.vm.titulo || !$scope.vm.categoria) {
            alert('Informe o título e a categoria do artigo.');
            return;
        }

        servicePainel.salvarArtigo($scope.vm)
            .then(() => {
                alert('Artigo salvo com sucesso!');
                $scope.vm = new Artigo();
                document.querySelectorAll('input[type="file"]').forEach(input => input.value = null);
            })
            .catch(e => {
                alert(`Falha ao salvar artigo. ${e.data && e.data.message ? e.data.message : ''}`);
                console.log('ERROR: ', e);
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

}).controller('painelAdmModalCtrl', function ($scope, $uibModalInstance, modal) {
    $scope.vm = modal.vm;

    $scope.close = () => {
        $uibModalInstance.close();
    }
});
