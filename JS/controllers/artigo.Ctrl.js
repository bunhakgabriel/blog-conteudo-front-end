import { API_URL } from "../apiConfig.js";

angular.module('myApp').factory('serviceArtigo', ['$http', function ($http) {
    return {
        buscarArtigoId: (id) => {
            return $http.get(`${API_URL}/artigos/${id}`)
                .then(response => response.data);
        }
    }
}]).controller('artigoCtrl', function ($scope, serviceArtigo) {
    $scope.vm = null;

    const init = () => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        serviceArtigo.buscarArtigoId(id)
            .then(artigo => {
                $scope.vm = artigo;
            })
            .catch(e => {
                alert(e.status === 404 ? 'Artigo não encontrado.' : 'Erro ao buscar o artigo.');
                console.log('ERROR: ', e);
            })
    }

    init();
})
