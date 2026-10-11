import { API_URL } from "../apiConfig.js";
import imagensCapa from "../../utils/objetoImagensCapa.js";

angular.module('myApp').factory('serviceIndex', ['$http', function ($http) {
    return {
        buscarArtigos: (categoria) => {
            return $http.get(`${API_URL}/artigos`, { params: { categoria } })
                .then(response => response.data);
        }
    }
}])
    .controller('indexCtrl', function ($scope, serviceIndex) {
        $scope.artigos = [];
        $scope.capa = '';

        $scope.buscarArtigos = (categoria) => {
            serviceIndex.buscarArtigos(categoria).then(artigos => {
                $scope.artigos = artigos;
                $scope.capa = imagensCapa[categoria];
            }).catch(e => {
                alert(`Erro ao obter artigos de: ${categoria}`);
                console.log('ERROR: ', e);
            })
        }

    });
