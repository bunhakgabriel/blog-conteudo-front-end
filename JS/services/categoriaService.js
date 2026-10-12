import { API_URL } from "../apiConfig.js";

// A API responde no formato { success, data, message }
angular.module('myApp').factory('serviceCategoria', ['$http', function ($http) {
    return {
        buscarCategorias: () => {
            return $http.get(`${API_URL}/categorias`)
                .then(response => response.data.data);
        },
        criarCategoria: (nome, capa) => {
            const formData = new FormData();
            formData.append('nome', nome);
            if (capa) formData.append('capa', capa);

            return $http.post(`${API_URL}/categorias`, formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(response => response.data);
        },
        excluirCategoria: (id) => {
            return $http.delete(`${API_URL}/categorias/${id}`)
                .then(response => response.data);
        }
    }
}]);
