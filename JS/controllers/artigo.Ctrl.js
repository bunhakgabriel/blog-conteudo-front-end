import "../services/artigoService.js";
import mensagemErro from "../../utils/mensagemErro.js";

angular.module('myApp').controller('artigoCtrl', function ($scope, serviceArtigo) {
    $scope.vm = null;

    const init = () => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        serviceArtigo.buscarArtigoId(id)
            .then(artigo => {
                $scope.vm = artigo;
            })
            .catch(e => {
                alert(mensagemErro(e, 'Erro ao buscar o artigo.'));
                console.log('ERROR: ', e);
            })
    }

    init();
})
